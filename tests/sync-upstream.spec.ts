import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const syncScript = path.join(root, ".github", "scripts", "sync-upstream.mjs");

const gitEnv = {
  ...process.env,
  GIT_AUTHOR_EMAIL: "test@example.com",
  GIT_AUTHOR_NAME: "test",
  GIT_COMMITTER_EMAIL: "test@example.com",
  GIT_COMMITTER_NAME: "test",
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_NOSYSTEM: "1",
};

interface SyncSummary {
  added: string[];
  base: string;
  baseApproximate: boolean;
  baseSource: string;
  changed: boolean;
  conflicts: { path: string; reason: string }[];
  deleted: string[];
  keptDeleted: string[];
  merged: string[];
  packageJsonChanged: boolean;
  protected: { path: string; reason: string }[];
  symlinks: string[];
  target: string;
  updated: string[];
}

interface FixtureOptions {
  /** Files of the upstream commit the fork starts from. */
  initial: Record<string, string | null>;
  /** Local files on top of `initial`. */
  local?: Record<string, string | null>;
  /** Local files on top of `initial`, before `local` is applied. */
  localBaseline?: Record<string, string | null>;
  /** Whether the fork shares history with upstream (clone) or not (template). */
  history?: "orphan" | "shared";
  /** Files changed by upstream after `initial`. */
  upstream: Record<string, string | null>;
  /** Mode changes applied to the `upstream` commit, keyed by path. */
  upstreamChmod?: Record<string, "100644" | "100755">;
  /** Extra upstream commits after `upstream`, oldest first. */
  upstreamHistory?: { files: Record<string, string | null>; message: string }[];
}

const tempRoots: string[] = [];

const makeTempRoot = (): string => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-sync-test-"));

  tempRoots.push(directory);

  return directory;
};

// Reads a JSON file from the fork, failing loudly instead of masking it with `?? "{}"`.
const readJson = (
  fixture: { forkFile: (relativePath: string) => string | null },
  relativePath: string,
): Record<string, unknown> => {
  const content = fixture.forkFile(relativePath);

  if (content == null) throw new Error(`${relativePath} is missing in the fork`);

  return JSON.parse(content) as Record<string, unknown>;
};

const git = (directory: string, ...args: string[]): string =>
  execFileSync("git", args, { cwd: directory, encoding: "utf8", env: gitEnv }).trim();

const writeFiles = (directory: string, files: Record<string, string | null>): void => {
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(directory, relativePath);

    if (content == null) {
      fs.rmSync(fullPath, { force: true });
      continue;
    }

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
};

const makeRepo = (directory: string): string => {
  fs.mkdirSync(directory, { recursive: true });
  git(directory, "init", "-q", "-b", "main");
  git(directory, "config", "user.name", "test");
  git(directory, "config", "user.email", "test@example.com");

  return directory;
};

const commit = (directory: string, message: string): string => {
  git(directory, "add", "-A");
  git(directory, "commit", "-q", "--allow-empty", "-m", message);

  return git(directory, "rev-parse", "HEAD");
};

// Commits whatever is already staged, so index-only changes (mode bits) survive.
const commitStaged = (directory: string, message: string): string => {
  git(directory, "commit", "-q", "--allow-empty", "-m", message);

  return git(directory, "rev-parse", "HEAD");
};

const readRepoFile = (directory: string, relativePath: string): string | null => {
  const fullPath = path.join(directory, relativePath);

  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
};

interface Fixture {
  fork: string;
  forkFile: (relativePath: string) => string | null;
  initialSha: string;
  run: (...extraArguments: string[]) => { report: string; summary: SyncSummary };
  status: () => string;
  temp: string;
  upstream: string;
  upstreamSha: string;
}

const createFixture = ({
  history = "orphan",
  initial,
  local = {},
  localBaseline = {},
  upstream,
  upstreamChmod,
  upstreamHistory = [],
}: FixtureOptions): Fixture => {
  const temp = makeTempRoot();
  const upstreamDirectory = makeRepo(path.join(temp, "upstream"));

  writeFiles(upstreamDirectory, initial);
  const initialSha = commit(upstreamDirectory, "initial");

  writeFiles(upstreamDirectory, upstream);
  git(upstreamDirectory, "add", "-A");

  // `git add -A` would drop an index-only chmod, so stage first and chmod after.
  for (const [relativePath, mode] of Object.entries(upstreamChmod ?? {})) {
    git(
      upstreamDirectory,
      "update-index",
      `--chmod=${mode === "100755" ? "+x" : "-x"}`,
      relativePath,
    );
  }

  const upstreamSha = commitStaged(upstreamDirectory, "upstream");

  for (const step of upstreamHistory) {
    writeFiles(upstreamDirectory, step.files);
    commit(upstreamDirectory, step.message);
  }

  const forkDirectory = path.join(temp, "fork");

  if (history === "shared") {
    // A real clone: `main` is reset to the initial commit and rewrites it locally.
    execFileSync("git", ["clone", "-q", upstreamDirectory, forkDirectory], {
      encoding: "utf8",
      env: gitEnv,
    });
    git(forkDirectory, "reset", "-q", "--hard", initialSha);
    git(forkDirectory, "config", "user.name", "test");
    git(forkDirectory, "config", "user.email", "test@example.com");
    git(forkDirectory, "remote", "rename", "origin", "upstream");
  } else {
    // What "Use this template" produces: an orphan squashed history.
    makeRepo(forkDirectory);
    writeFiles(forkDirectory, initial);
    writeFiles(forkDirectory, localBaseline);
    commit(forkDirectory, "fork: start from template");
    git(forkDirectory, "remote", "add", "upstream", upstreamDirectory);
  }

  writeFiles(forkDirectory, local);
  commit(forkDirectory, "fork: local changes");
  git(forkDirectory, "fetch", "-q", "--no-tags", "upstream", "main");

  const run = (...extraArguments: string[]): { report: string; summary: SyncSummary } => {
    const reportPath = path.join(temp, "report.md");
    const summaryPath = path.join(temp, "summary.json");

    execFileSync(
      process.execPath,
      [
        syncScript,
        "--repo",
        forkDirectory,
        "--upstream",
        "upstream/main",
        "--report",
        reportPath,
        "--summary",
        summaryPath,
        ...extraArguments,
      ],
      { cwd: forkDirectory, encoding: "utf8", env: gitEnv },
    );

    return {
      report: fs.readFileSync(reportPath, "utf8"),
      summary: JSON.parse(fs.readFileSync(summaryPath, "utf8")) as SyncSummary,
    };
  };

  return {
    fork: forkDirectory,
    forkFile: (relativePath: string): string | null => readRepoFile(forkDirectory, relativePath),
    initialSha,
    run,
    status: () => git(forkDirectory, "status", "--porcelain"),
    temp,
    upstream: upstreamDirectory,
    upstreamSha,
  };
};

describe("upstream sync", () => {
  // Every test creates real git repositories in the temp directory.
  // oxlint-disable-next-line vitest/no-hooks
  afterEach(() => {
    for (const directory of tempRoots.splice(0))
      fs.rmSync(directory, { recursive: true, force: true });
  });

  it("applies template changes while keeping non-conflicting local edits", () => {
    const fixture = createFixture({
      initial: { "src/app.ts": "one\ntwo\nthree\nfour\nfive\nsix\n" },
      local: { "src/app.ts": "one local\ntwo\nthree\nfour\nfive\nsix\n" },
      upstream: {
        "src/app.ts": "one\ntwo\nthree\nfour\nfive\nsix upstream\n",
        "src/new.ts": "brand new\n",
      },
    });

    const { report, summary } = fixture.run();

    expect(fixture.forkFile("src/app.ts")).toBe(
      "one local\ntwo\nthree\nfour\nfive\nsix upstream\n",
    );
    expect(fixture.forkFile("src/new.ts")).toBe("brand new\n");
    expect(summary.merged).toStrictEqual(["src/app.ts"]);
    expect(summary.added).toStrictEqual(["src/new.ts"]);
    expect(summary.changed).toBe(true);
    expect(report).toContain("#### ✅ Applied");
    expect(report).toContain("- added `src/new.ts`");
    expect(report).toContain("#### 🔀 Merged with your changes");
  });

  it("keeps the local version when both sides changed the same lines", () => {
    const fixture = createFixture({
      initial: { "src/app.ts": "one\ntwo\nthree\nfour\nfive\n" },
      local: { "src/app.ts": "one\ntwo\nLOCAL\nfour\nfive\n" },
      upstream: { "src/app.ts": "one\ntwo\nUPSTREAM\nfour\nfive\n" },
    });

    const { report, summary } = fixture.run();

    expect(fixture.forkFile("src/app.ts")).toBe("one\ntwo\nLOCAL\nfour\nfive\n");
    expect(fixture.forkFile("src/app.ts")).not.toContain("<<<<<<<");
    expect(summary.conflicts).toStrictEqual([
      {
        path: "src/app.ts",
        reason: "both sides changed the same lines (1 conflicting hunk(s)) — kept yours",
      },
    ]);
    expect(report).toContain("Kept your version");
  });

  it("never overwrites instance files", () => {
    const fixture = createFixture({
      initial: {
        ".github/workflows/linter.yml": "name: Linter\n",
        "AGENTS.md": "upstream agents\n",
        LICENSE: "MIT upstream\n",
        "README.md": "upstream readme\n",
        "config.yml": "name: upstream\n",
        "public/bg.avif": "upstream asset\n",
        "src/app.ts": "one\n",
      },
      local: {
        "AGENTS.md": "my agents\n",
        LICENSE: "MIT me\n",
        "README.md": "# me\n",
        "config.yml": "name: me\n",
        "public/bg.avif": "my asset\n",
      },
      upstream: {
        ".github/workflows/linter.yml": "name: Linter v2\n",
        "AGENTS.md": "upstream agents v2\n",
        LICENSE: "MIT upstream v2\n",
        "README.md": "upstream readme v2\n",
        "config.yml": "name: upstream v2\n",
        "public/bg.avif": "upstream asset v2\n",
        "public/new.avif": "new asset\n",
        "src/app.ts": "one upstream\n",
      },
    });

    const { summary } = fixture.run();

    expect({
      ".github/workflows/linter.yml": fixture.forkFile(".github/workflows/linter.yml"),
      "AGENTS.md": fixture.forkFile("AGENTS.md"),
      LICENSE: fixture.forkFile("LICENSE"),
      "README.md": fixture.forkFile("README.md"),
      "config.yml": fixture.forkFile("config.yml"),
      "public/bg.avif": fixture.forkFile("public/bg.avif"),
      "public/new.avif": fixture.forkFile("public/new.avif"),
      "src/app.ts": fixture.forkFile("src/app.ts"),
    }).toStrictEqual({
      ".github/workflows/linter.yml": "name: Linter\n",
      "AGENTS.md": "my agents\n",
      LICENSE: "MIT me\n",
      "README.md": "# me\n",
      "config.yml": "name: me\n",
      "public/bg.avif": "my asset\n",
      "public/new.avif": null,
      "src/app.ts": "one upstream\n",
    });
    expect(summary.protected.map((item) => item.path).sort()).toStrictEqual([
      ".github/workflows/linter.yml",
      "AGENTS.md",
      "LICENSE",
      "README.md",
      "config.yml",
      "public/bg.avif",
      "public/new.avif",
    ]);
  });

  it("does not resurrect a file the user deleted", () => {
    const fixture = createFixture({
      initial: { "docs/en.md": "v1\n", "src/app.ts": "one\n" },
      localBaseline: { "docs/en.md": null },
      upstream: { "docs/en.md": "v2\n" },
    });

    const { summary } = fixture.run();

    expect(fixture.forkFile("docs/en.md")).toBeNull();
    expect(summary.keptDeleted).toStrictEqual(["docs/en.md"]);
  });

  it("removes files deleted upstream when they were not modified", () => {
    const fixture = createFixture({
      initial: { "src/old.ts": "old\n", "src/app.ts": "one\n" },
      upstream: { "src/app.ts": "one upstream\n", "src/old.ts": null },
    });

    const { summary } = fixture.run();

    expect(fixture.forkFile("src/old.ts")).toBeNull();
    expect(summary.deleted).toStrictEqual(["src/old.ts"]);
  });

  it("keeps a locally modified file that was deleted upstream", () => {
    const fixture = createFixture({
      initial: { "src/old.ts": "old\n", "src/app.ts": "one\n" },
      local: { "src/old.ts": "old local\n" },
      upstream: { "src/old.ts": null },
    });

    const { summary } = fixture.run();

    expect(fixture.forkFile("src/old.ts")).toBe("old local\n");
    expect(summary.conflicts).toStrictEqual([
      { path: "src/old.ts", reason: "removed upstream, but you modified it — kept yours" },
    ]);
  });

  it("merges package.json field by field", () => {
    const fixture = createFixture({
      initial: {
        "package.json": `${JSON.stringify(
          {
            dependencies: { react: "^19.0.0" },
            devDependencies: { vite: "^7.0.0" },
            name: "portfolio-template",
            version: "0.0.0",
          },
          null,
          2,
        )}\n`,
      },
      local: {
        "package.json": `${JSON.stringify(
          {
            dependencies: { extra: "^1.0.0", react: "^19.0.0" },
            devDependencies: { vite: "^7.0.0" },
            name: "my-site",
            version: "1.0.0",
          },
          null,
          2,
        )}\n`,
      },
      upstream: {
        "package.json": `${JSON.stringify(
          {
            dependencies: { react: "^19.3.1" },
            devDependencies: { vite: "^8.0.0" },
            name: "portfolio-template",
            scripts: { build: "vite build" },
            version: "0.0.0",
          },
          null,
          2,
        )}\n`,
      },
    });

    const { summary } = fixture.run();
    const merged = readJson(fixture, "package.json");

    expect(merged.dependencies).toStrictEqual({ extra: "^1.0.0", react: "^19.3.1" });
    expect(merged.devDependencies).toStrictEqual({ vite: "^8.0.0" });
    expect({ name: merged.name, version: merged.version }).toStrictEqual({
      name: "my-site",
      version: "1.0.0",
    });
    expect(merged.scripts).toStrictEqual({ build: "vite build" });
    expect(summary.packageJsonChanged).toBe(true);
  });

  it("records the synced commit and does nothing on the next run", () => {
    const fixture = createFixture({
      initial: { "src/app.ts": "one\n" },
      upstream: { "src/app.ts": "one upstream\n" },
    });

    const first = fixture.run();

    expect(first.summary.baseSource).toBe("heuristic");
    expect(readJson(fixture, ".github/sync-state.json")).toMatchObject({
      lastSyncedCommit: fixture.upstreamSha,
      lastSyncSource: "heuristic",
    });
    const second = fixture.run();

    expect(second.summary.changed).toBe(false);
    expect(second.summary.added).toStrictEqual([]);
    expect(second.summary.updated).toStrictEqual([]);
    expect(second.summary.baseSource).toBe("state");
    expect(second.summary.base).toBe(fixture.upstreamSha);
  });

  it("uses the merge base when the fork shares history with upstream", () => {
    const fixture = createFixture({
      history: "shared",
      initial: { "src/app.ts": "one\ntwo\nthree\nfour\nfive\n" },
      local: { "src/app.ts": "one local\ntwo\nthree\nfour\nfive\n" },
      upstream: { "src/app.ts": "one\ntwo\nthree\nfour\nfive upstream\n" },
    });

    const { summary } = fixture.run();

    expect(summary.baseSource).toBe("merge-base");
    expect(summary.base).toBe(fixture.initialSha);
    expect(fixture.forkFile("src/app.ts")).toBe("one local\ntwo\nthree\nfour\nfive upstream\n");
  });

  it("honours protected and unprotected overrides from the state file", () => {
    const fixture = createFixture({
      initial: { "AGENTS.md": "v1\n", "README.md": "readme v1\n" },
      upstream: { "AGENTS.md": "v2\n", "README.md": "readme v2\n" },
    });

    fs.mkdirSync(path.join(fixture.fork, ".github"), { recursive: true });
    fs.writeFileSync(
      path.join(fixture.fork, ".github", "sync-state.json"),
      `${JSON.stringify({ unprotected: ["AGENTS.md"] }, null, 2)}\n`,
    );

    const { summary } = fixture.run();

    expect(fixture.forkFile("AGENTS.md")).toBe("v2\n");
    expect(fixture.forkFile("README.md")).toBe("readme v1\n");
    expect(summary.updated).toStrictEqual(["AGENTS.md"]);
    expect(summary.protected.map((item) => item.path)).toStrictEqual(["README.md"]);
  });

  it("reports without touching anything in dry-run mode", () => {
    const fixture = createFixture({
      initial: { "src/app.ts": "one\n" },
      upstream: { "src/app.ts": "one upstream\n" },
    });

    const { summary } = fixture.run("--dry-run");

    expect(summary.changed).toBe(true);
    expect(fixture.forkFile("src/app.ts")).toBe("one\n");
    expect(fixture.status()).toBe("");
  });

  it("reports an unconfirmed base instead of recording it", () => {
    const fixture = createFixture({
      initial: { "src/app.ts": "one\n" },
      upstream: { "src/one.ts": "one\n" },
      upstreamHistory: [
        { files: { "src/two.ts": "two\n" }, message: "upstream: two" },
        { files: { "src/app.ts": "one upstream\n" }, message: "upstream: app" },
      ],
    });

    const { report, summary } = fixture.run("--depth", "2");

    expect(summary.baseSource).toBe("heuristic");
    expect(summary.baseApproximate).toBe(true);
    expect(summary.base).toBe(git(fixture.upstream, "rev-parse", "HEAD~1"));
    expect(summary.updated).toStrictEqual(["src/app.ts"]);
    expect(fixture.forkFile("src/two.ts")).toBeNull();
    expect(fixture.forkFile(".github/sync-state.json")).toBeNull();
    expect(report).toContain("Base commit not confirmed");
  });

  it("applies a mode-only change from upstream", () => {
    const fixture = createFixture({
      initial: { "scripts/run.sh": "echo hi\n" },
      upstream: {},
      upstreamChmod: { "scripts/run.sh": "100755" },
    });

    const { summary } = fixture.run();

    expect(summary.updated).toStrictEqual(["scripts/run.sh"]);
    expect(() =>
      fs.accessSync(path.join(fixture.fork, "scripts", "run.sh"), fs.constants.X_OK),
    ).not.toThrow();
  });

  it("merges nested package.json fields and drops what upstream removed", () => {
    const packageJson = (value: Record<string, unknown>): string =>
      `${JSON.stringify(value, null, 2)}\n`;
    const fixture = createFixture({
      initial: {
        "package.json": packageJson({
          dependencies: { react: "^19.0.0", vue: "^3.5.0" },
          name: "portfolio-template",
        }),
      },
      local: {
        "package.json": packageJson({
          dependencies: { react: "^19.2.0", vue: "^3.5.0" },
          name: "my-site",
        }),
      },
      upstream: {
        "package.json": packageJson({
          dependencies: { react: "^19.3.1" },
          name: "portfolio-template",
        }),
      },
    });

    const { summary } = fixture.run();
    const merged = readJson(fixture, "package.json");

    expect(merged.dependencies).toStrictEqual({ react: "^19.2.0" });
    expect(summary.packageJsonChanged).toBe(true);
  });

  it("keeps workflow and lockfile files protected even when listed as unprotected", () => {
    const fixture = createFixture({
      initial: {
        ".github/workflows/linter.yml": "name: Linter\n",
        "pnpm-lock.yaml": "lockfile v1\n",
      },
      upstream: {
        ".github/workflows/linter.yml": "name: Linter v2\n",
        "pnpm-lock.yaml": "lockfile v2\n",
      },
    });

    fs.mkdirSync(path.join(fixture.fork, ".github"), { recursive: true });
    fs.writeFileSync(
      path.join(fixture.fork, ".github", "sync-state.json"),
      `${JSON.stringify({ unprotected: [".github/workflows/*", "pnpm-lock.yaml"] }, null, 2)}\n`,
    );

    const { summary } = fixture.run();

    expect(fixture.forkFile(".github/workflows/linter.yml")).toBe("name: Linter\n");
    expect(fixture.forkFile("pnpm-lock.yaml")).toBe("lockfile v1\n");
    expect(summary.protected).toStrictEqual([
      { path: ".github/workflows/linter.yml", reason: "workflow" },
    ]);
  });

  it("refuses to write through a symlinked directory that leaves the repository", () => {
    const fixture = createFixture({
      initial: { "docs/en.md": "v1\n" },
      upstream: { "docs/en.md": "v2\n" },
    });
    const outside = path.join(fixture.temp, "outside");

    fs.mkdirSync(outside, { recursive: true });
    fs.writeFileSync(path.join(outside, "en.md"), "v1\n");
    fs.rmSync(path.join(fixture.fork, "docs"), { recursive: true, force: true });
    fs.symlinkSync(outside, path.join(fixture.fork, "docs"));

    expect(() => fixture.run()).toThrow(/outside the repository/u);
    expect(fs.readFileSync(path.join(outside, "en.md"), "utf8")).toBe("v1\n");
  });

  it("fails with a helpful message when upstream is missing", () => {
    const fixture = createFixture({
      initial: { "src/app.ts": "one\n" },
      upstream: { "src/app.ts": "one upstream\n" },
    });

    git(fixture.fork, "remote", "remove", "upstream");

    expect(() => fixture.run()).toThrow(/Cannot resolve "upstream\/main"/u);
  });
});
