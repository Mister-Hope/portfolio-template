#!/usr/bin/env node

/**
 * Incremental upstream sync for repositories created from the portfolio template.
 *
 * The previous workflow replaced the whole tree with upstream's tree and then restored a hard-coded
 * allow list of "user files". Everything outside that list (AGENTS.md, LICENSE, src/, docs/, ...)
 * was silently overwritten.
 *
 * This script instead replays only the changes upstream made since the commit this repository was
 * last synced with. Every touched file is three-way merged from `base` (upstream at the last synced
 * commit), `ours` (this working tree) and `theirs` (upstream at the commit we sync to).
 *
 * Consequences:
 *
 * - Non-overlapping local edits are merged automatically;
 * - Overlapping local edits are kept and reported for manual review;
 * - Files deleted locally are not resurrected;
 * - Upstream deletions are applied unless the file was modified locally;
 * - Instance-owned files (config, README, LICENSE, AGENTS.md, public assets, workflow files,
 *   lockfile) are never written automatically, only reported;
 * - `package.json` is merged per field so template dependency bumps land while the personal metadata,
 *   extra scripts and extra dependencies survive.
 *
 * The commit that was synced is recorded in `.github/sync-state.json` so the next run only replays
 * what is actually new.
 *
 * CLI contract (kept stable for `.github/workflows/sync-upstream.yml`):
 *
 * node .github/scripts/sync-upstream.mjs\
 * [--repo <dir>] [--upstream <ref>] [--base <sha>] [--depth <n>]\
 * [--state <path>] [--report <file>] [--summary <file>] [--dry-run]
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const TEMPLATE_SLUG = "Mister-Hope/portfolio-template";
const TEMPLATE_URL = `https://github.com/${TEMPLATE_SLUG}`;
const MAX_BUFFER = 256 * 1024 * 1024;
const DEFAULT_DEPTH = 300;
const DEFAULT_STATE_PATH = ".github/sync-state.json";
const MAX_REPORTED_ITEMS = 60;

/**
 * Files that belong to the site instance rather than to the template. Upstream edits to them are
 * reported, never applied: a user's LICENSE copyright, README, configuration, assets and agent
 * instructions are their own.
 *
 * `.github/workflows/**` is special: GitHub Actions cannot push workflow file changes with the
 * default token, so they are always left for a manual update.
 */
const DEFAULT_PROTECTED = [
  "config.ts",
  "config.js",
  "config.json",
  "config.yml",
  "config.yaml",
  "custom.css",
  "public/**",
  "README.md",
  "README-*.md",
  "README.*.md",
  "LICENSE",
  "LICENSE.*",
  "COPYING",
  "COPYING.*",
  "AGENTS.md",
  "CLAUDE.md",
  "SECURITY.md",
];

const WORKFLOW_PATTERN = /^\.github\/workflows\//iu;
const LOCKFILE_PATTERN = /^pnpm-lock\.yaml$/iu;
const STATE_PATTERN = /^\.github\/sync-state\.json$/iu;

const globToRegExp = (glob) => {
  let source = "^";

  for (let index = 0; index < glob.length; index++) {
    const char = glob[index];

    if (char === "*" && glob[index + 1] === "*") {
      index += 1;
      // `a/**/b` matches `a/b` and `a/x/b`; `public/**` matches everything below it.
      if (glob[index + 1] === "/") {
        index += 1;
        source += "(?:.*/)?";
      } else source += ".*";
    } else if (char === "*") source += "[^/]*";
    else if (char === "?") source += "[^/]";
    else source += char.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`);
  }

  return new RegExp(`${source}$`, "iu");
};

// stderr is piped instead of inherited: `rev-parse --verify` and `merge-base`
// fail by design while probing, and their noise would drown the real output.
const git = (repo, args, options = {}) =>
  execFileSync("git", args, {
    cwd: repo,
    maxBuffer: MAX_BUFFER,
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });

const gitText = (repo, args) => git(repo, args, { encoding: "utf8" }).trim();

const gitBuffer = (repo, args) => git(repo, args, { encoding: "buffer" });

const tryGit = (repo, args, options = {}) => {
  try {
    return git(repo, args, options);
  } catch {
    // Probing commands (`merge-base`, `rev-parse --verify`) fail by design;
    // `undefined` is the "no answer" signal.
  }
};

const tryGitText = (repo, args) => {
  const result = tryGit(repo, args, { encoding: "utf8" });

  return result === undefined ? undefined : result.trim();
};

const revParse = (repo, ref) => tryGitText(repo, ["rev-parse", "--verify", `${ref}^{commit}`]);

const isAncestor = (repo, ancestor, descendant) =>
  tryGit(repo, ["merge-base", "--is-ancestor", ancestor, descendant]) !== undefined;

const readBlob = (repo, sha) => {
  if (!sha || /^0+$/u.test(sha)) return null;

  return gitBuffer(repo, ["cat-file", "blob", sha]);
};

const countChangedPaths = (repo, from, to) => {
  const output = git(repo, ["diff", "--name-only", "-z", "--no-renames", from, to], {
    encoding: "utf8",
  });

  return output.split("\0").filter(Boolean).length;
};

/**
 * Parse `git diff --raw -z` output: `:oldMode newMode oldSha newSha status\0path\0`.
 *
 * @returns {{
 *   oldMode: string;
 *   newMode: string;
 *   oldSha: string;
 *   newSha: string;
 *   status: string;
 *   path: string;
 * }[]}
 */
const parseRawDiff = (repo, from, to) => {
  const output = git(
    repo,
    ["diff", "--raw", "-z", "--no-renames", "--no-ext-diff", "--no-color", from, to],
    { encoding: "utf8" },
  );
  const parts = output.split("\0");
  const entries = [];

  for (let index = 0; index + 1 < parts.length; index += 2) {
    const meta = parts[index];
    const file = parts[index + 1];

    if (!meta.startsWith(":") || !file) continue;

    const [oldMode, newMode, oldSha, newSha, status] = meta.slice(1).split(" ");

    entries.push({ oldMode, newMode, oldSha, newSha, status: status[0], path: file });
  }

  return entries;
};

const isBinary = (buffer) => buffer != null && buffer.subarray(0, 8000).includes(0);

const countConflictMarkers = (buffer) => (buffer.toString("utf8").match(/^<{7} /gmu) ?? []).length;

/** Three-way merge through `git merge-file`. Conflicts are never written out. */
const threeWayMerge = (ours, base, theirs) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-sync-"));

  try {
    const [oursFile, baseFile, theirsFile] = [
      ["ours", ours],
      ["base", base],
      ["theirs", theirs],
    ].map(([name, content]) => {
      const file = path.join(directory, name);

      fs.writeFileSync(file, content);

      return file;
    });

    try {
      return {
        ok: true,
        merged: git(directory, ["merge-file", "-p", oursFile, baseFile, theirsFile], {
          encoding: "buffer",
        }),
      };
    } catch (error) {
      const stdout = error?.stdout;
      const code = error?.status;

      // 1-127 = number of conflicts, anything else is a hard failure.
      if (typeof code !== "number" || code < 1 || code > 127) {
        return { ok: false, error: String(error?.stderr ?? error) };
      }

      return {
        ok: false,
        conflicts: Buffer.isBuffer(stdout) ? countConflictMarkers(stdout) : 1,
      };
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
};

const deepEqual = (left, right) => {
  if (left === right) return true;
  if (typeof left !== "object" || typeof right !== "object" || left == null || right == null) {
    return false;
  }
  if (Array.isArray(left) !== Array.isArray(right)) return false;
  if (Array.isArray(left)) {
    return (
      left.length === right.length && left.every((value, index) => deepEqual(value, right[index]))
    );
  }

  const leftKeys = Object.keys(left);

  return (
    leftKeys.length === Object.keys(right).length &&
    leftKeys.every((key) => Object.hasOwn(right, key) && deepEqual(left[key], right[key]))
  );
};

const isPlainObject = (value) =>
  typeof value === "object" && value != null && !Array.isArray(value);

/**
 * Field-by-field three-way merge of `package.json`, so upstream dependency bumps and scripts land
 * while personal metadata and extra dependencies survive.
 *
 * A field edited on both sides is reported and the local value is kept.
 */
const mergePackageJson = (ours, base, theirs) => {
  const conflicts = [];

  const merge = (ourValue, baseValue, theirValue, at) => {
    if (deepEqual(ourValue, baseValue)) return theirValue;
    if (deepEqual(theirValue, baseValue)) return ourValue;
    if (deepEqual(ourValue, theirValue)) return ourValue;

    if (
      isPlainObject(ourValue) &&
      isPlainObject(theirValue) &&
      (baseValue === undefined || isPlainObject(baseValue))
    ) {
      const baseObject = baseValue ?? {};
      const merged = {};

      for (const key of new Set([
        ...Object.keys(baseObject),
        ...Object.keys(ourValue),
        ...Object.keys(theirValue),
      ])) {
        const childPath = at ? `${at}.${key}` : key;

        if (key in ourValue && key in theirValue) {
          merged[key] = merge(ourValue[key], baseObject[key], theirValue[key], childPath);
        } else if (key in ourValue) {
          // Upstream removed the field: drop it only when the user never touched it.
          if (!(key in baseObject)) merged[key] = ourValue[key];
          else if (!deepEqual(ourValue[key], baseObject[key])) {
            merged[key] = ourValue[key];
            conflicts.push(`${childPath} (removed upstream, changed locally)`);
          }
        } else if (key in theirValue) {
          // The user removed the field: respect that, but report upstream changes.
          if (key in baseObject && !deepEqual(theirValue[key], baseObject[key])) {
            conflicts.push(`${childPath} (changed upstream, removed locally)`);
          } else if (!(key in baseObject)) merged[key] = theirValue[key];
        }
      }

      return merged;
    }

    conflicts.push(`${at || "package.json"} (changed on both sides)`);

    return ourValue;
  };

  return { value: merge(ours, base, theirs, ""), conflicts };
};

const resolveInRepo = (repo, relativePath) => {
  const fullPath = path.resolve(repo, relativePath);
  const realRepo = fs.realpathSync(repo);

  if (fullPath === repo) return fullPath;

  if (!fullPath.startsWith(`${repo}${path.sep}`)) {
    throw new Error(`Refusing to touch a path outside the repository: ${relativePath}`);
  }

  // A symlinked directory inside the repository can point anywhere, so the
  // closest existing ancestor has to resolve back inside the repository too.
  let ancestor = path.dirname(fullPath);

  while (ancestor !== repo && !fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);

  const realAncestor = fs.realpathSync(ancestor);

  if (realAncestor !== realRepo && !realAncestor.startsWith(`${realRepo}${path.sep}`)) {
    throw new Error(`Refusing to touch a path outside the repository: ${relativePath}`);
  }

  return fullPath;
};

const readWorktreeFile = (repo, relativePath) => {
  const fullPath = resolveInRepo(repo, relativePath);

  try {
    const stat = fs.lstatSync(fullPath);

    if (!stat.isFile()) return { state: "not-file" };

    return { state: "file", data: fs.readFileSync(fullPath) };
  } catch (error) {
    if (error?.code === "ENOENT") return { state: "missing" };

    throw error;
  }
};

const writeWorktreeFile = (repo, relativePath, data, mode) => {
  const fullPath = resolveInRepo(repo, relativePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, data);

  if (mode === "100755") fs.chmodSync(fullPath, 0o755);
  else if (mode === "100644") fs.chmodSync(fullPath, 0o644);
};

// A chmod-only upstream commit changes nothing but the mode, and `git merge-file`
// never sees it, so the worktree has to be updated on its own.
const applyModeChange = (repo, relativePath, entry, dryRun) => {
  if (entry.oldMode === entry.newMode) return false;
  if (entry.newMode !== "100644" && entry.newMode !== "100755") return false;

  if (!dryRun) {
    const fullPath = resolveInRepo(repo, relativePath);

    fs.chmodSync(fullPath, entry.newMode === "100755" ? 0o755 : 0o644);
  }

  return true;
};

const removeWorktreeFile = (repo, relativePath) => {
  const fullPath = resolveInRepo(repo, relativePath);

  fs.rmSync(fullPath, { force: true });

  // Git does not track directories; prune any directory that became empty.
  let directory = path.dirname(fullPath);

  while (directory !== repo && directory.startsWith(`${repo}${path.sep}`)) {
    if (!fs.existsSync(directory) || fs.readdirSync(directory).length > 0) break;
    fs.rmdirSync(directory);
    directory = path.dirname(directory);
  }
};

const readState = (repo, statePath) => {
  const fullPath = path.join(repo, statePath);

  try {
    const parsed = JSON.parse(fs.readFileSync(fullPath, "utf8"));

    return isPlainObject(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const protectMatcher = (state) => {
  const patterns = [
    ...DEFAULT_PROTECTED,
    ...(Array.isArray(state.protected) ? state.protected : []),
  ]
    .filter((pattern) => typeof pattern === "string" && pattern.length > 0)
    .map((pattern) => globToRegExp(pattern));
  const exceptions = (Array.isArray(state.unprotected) ? state.unprotected : [])
    .filter((pattern) => typeof pattern === "string" && pattern.length > 0)
    .map((pattern) => globToRegExp(pattern));

  return (relativePath) => {
    if (WORKFLOW_PATTERN.test(relativePath)) return "workflow";
    if (LOCKFILE_PATTERN.test(relativePath)) return "lockfile";
    if (STATE_PATTERN.test(relativePath)) return "state";
    if (!patterns.some((pattern) => pattern.test(relativePath))) return null;
    if (exceptions.some((pattern) => pattern.test(relativePath))) return null;

    return "instance";
  };
};

const findBaseCommit = ({ repo, upstreamRef, target, depth, state, log }) => {
  const recorded = typeof state.lastSyncedCommit === "string" ? state.lastSyncedCommit : undefined;

  if (recorded && revParse(repo, recorded)) {
    if (isAncestor(repo, recorded, target)) {
      log(`[base] using the commit recorded in the sync state (${recorded.slice(0, 7)})`);

      return { sha: recorded, source: "state", approximate: false };
    }

    log(
      `[base] the recorded commit ${recorded.slice(0, 7)} is not part of upstream any more, ignoring it`,
    );
  }

  const mergeBase = tryGitText(repo, ["merge-base", "HEAD", upstreamRef]);

  if (mergeBase) {
    log(`[base] using the common ancestor with upstream (${mergeBase.slice(0, 7)})`);

    return { sha: mergeBase, source: "merge-base", approximate: false };
  }

  // Template-created repositories have an orphan history, so there is no merge
  // base. The last synced commit is the upstream commit whose tree differs the
  // least from HEAD: the user's own files differ for every candidate, template
  // files they never touched only differ for the candidates after the real base.
  //
  // The oldest commit that reaches the minimum is the real base: a candidate is
  // as close as the base only while upstream changed nothing but the user's own
  // files, so the minimum is reached from the base onwards. Picking the newest
  // one instead would silently skip upstream changes to files the user edited.
  log(`[base] no shared history, scanning up to ${depth} upstream commits`);

  const newestFirst = gitText(repo, ["rev-list", `--max-count=${depth}`, upstreamRef])
    .split("\n")
    .filter(Boolean);
  const candidates = newestFirst.toReversed();
  let best;

  for (const [index, sha] of candidates.entries()) {
    const changed = countChangedPaths(repo, "HEAD", sha);

    if (!best || changed < best.changed) best = { sha, changed, index };

    // An identical tree is the base beyond any doubt.
    if (best.changed === 0) break;

    if (index > 0 && index % 50 === 0)
      log(`[base] checked ${index}/${candidates.length} candidates`);
  }

  if (!best) throw new Error(`Could not find any commit in ${upstreamRef}`);

  // An exhausted window means the closest candidate is simply the oldest commit
  // scanned: the real base may be older, and the diff would silently skip every
  // commit before it. Report it, and never record such a base as fully synced.
  const approximate = candidates.length >= depth && best.changed > 0;

  if (approximate) {
    log(
      `[base] warning: no confident match within the last ${depth} upstream commits, ` +
        "so older template changes may be skipped. Re-run with --base <sha> or a larger --depth.",
    );
  }

  log(`[base] best match ${best.sha.slice(0, 7)} (${best.changed} file(s) differ from HEAD)`);

  return { sha: best.sha, source: "heuristic", approximate };
};

const createReport = (base, target, state) => ({
  added: [],
  updated: [],
  deleted: [],
  merged: [],
  conflicts: [],
  keptDeleted: [],
  protected: [],
  symlinks: [],
  base,
  target,
  baseSource: state.source,
  baseApproximate: Boolean(state.approximate),
  packageJsonChanged: false,
});

const noteProtected = (context, entry, reason) => {
  if (reason === "lockfile" || reason === "state") return;

  const theirs = entry.status === "D" ? null : readBlob(context.repo, entry.newSha);
  const ours = readWorktreeFile(context.repo, entry.path);

  if (ours.state === "file" && theirs != null && ours.data.equals(theirs)) return;
  if (ours.state === "missing" && theirs == null) return;

  context.report.protected.push({ path: entry.path, reason });
};

const syncPackageJson = (context, entry) => {
  const { repo, report } = context;
  const ours = readWorktreeFile(repo, entry.path);

  if (entry.status === "D") {
    report.conflicts.push({
      path: entry.path,
      reason: "removed upstream, but package.json is required — kept yours",
    });

    return;
  }

  if (ours.state !== "file") {
    report.conflicts.push({ path: entry.path, reason: "not a regular file — kept as-is" });

    return;
  }

  const theirs = readBlob(repo, entry.newSha);

  if (theirs == null || ours.data.equals(theirs)) return;

  let ourValue;
  let theirValue;

  try {
    ourValue = JSON.parse(ours.data.toString("utf8"));
    theirValue = JSON.parse(theirs.toString("utf8"));
  } catch {
    report.conflicts.push({ path: entry.path, reason: "unparsable JSON — kept yours" });

    return;
  }

  const baseBuffer = readBlob(repo, entry.oldSha);
  let baseValue = {};

  if (baseBuffer) {
    try {
      baseValue = JSON.parse(baseBuffer.toString("utf8"));
    } catch {
      baseValue = {};
    }
  }

  const { value, conflicts } = mergePackageJson(ourValue, baseValue, theirValue);
  const next = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);

  if (next.equals(ours.data)) return;

  if (!context.dryRun) writeWorktreeFile(repo, entry.path, next, entry.newMode);

  report.packageJsonChanged = true;

  if (conflicts.length > 0) {
    report.merged.push({
      path: entry.path,
      note: `kept your value for ${conflicts.join(", ")}`,
    });
  } else report.updated.push(entry.path);
};

const syncEntry = (context, entry) => {
  const { repo, report, dryRun } = context;
  const relativePath = entry.path;
  const reason = context.isProtected(relativePath);

  if (reason) {
    noteProtected(context, entry, reason);

    return;
  }

  if (relativePath === "package.json") {
    syncPackageJson(context, entry);

    return;
  }

  if (entry.oldMode === "120000" || entry.newMode === "120000") {
    report.symlinks.push(relativePath);

    return;
  }

  const theirs = entry.status === "D" ? null : readBlob(repo, entry.newSha);
  const base = readBlob(repo, entry.oldSha);
  const ours = readWorktreeFile(repo, relativePath);

  if (entry.status === "D") {
    if (ours.state === "missing") return;

    if (ours.state !== "file") {
      report.conflicts.push({
        path: relativePath,
        reason: "removed upstream, but something else exists here — kept yours",
      });

      return;
    }

    if (base != null && ours.data.equals(base)) {
      if (!dryRun) removeWorktreeFile(repo, relativePath);
      report.deleted.push(relativePath);
    } else {
      report.conflicts.push({
        path: relativePath,
        reason: "removed upstream, but you modified it — kept yours",
      });
    }

    return;
  }

  if (ours.state === "not-file") {
    report.conflicts.push({ path: relativePath, reason: "not a regular file — kept as-is" });

    return;
  }

  if (ours.state === "missing") {
    if (base != null) {
      // The user deleted this file on purpose; do not resurrect it.
      report.keptDeleted.push(relativePath);

      return;
    }

    if (theirs != null) {
      if (!dryRun) writeWorktreeFile(repo, relativePath, theirs, entry.newMode);
      report.added.push(relativePath);
    }

    return;
  }

  if (theirs == null) return;

  if (ours.data.equals(theirs)) {
    // Mode-only change (`chmod +x`): the content is already identical.
    if (applyModeChange(repo, relativePath, entry, dryRun)) report.updated.push(relativePath);

    return;
  }

  if (base != null && ours.data.equals(base)) {
    if (!dryRun) writeWorktreeFile(repo, relativePath, theirs, entry.newMode);
    report.updated.push(relativePath);

    return;
  }

  if (base == null) {
    report.conflicts.push({
      path: relativePath,
      reason: "added upstream, but you already have a different file — kept yours",
    });

    return;
  }

  if (isBinary(ours.data) || isBinary(base) || isBinary(theirs)) {
    report.conflicts.push({
      path: relativePath,
      reason: "binary file changed on both sides — kept yours",
    });

    return;
  }

  const merge = threeWayMerge(ours.data, base, theirs);

  if (!merge.ok) {
    report.conflicts.push({
      path: relativePath,
      reason: merge.error
        ? `automatic merge failed (${merge.error}) — kept yours`
        : `both sides changed the same lines (${merge.conflicts} conflicting hunk(s)) — kept yours`,
    });

    return;
  }

  if (merge.merged.equals(ours.data)) {
    if (applyModeChange(repo, relativePath, entry, dryRun)) report.updated.push(relativePath);

    return;
  }

  if (!dryRun) writeWorktreeFile(repo, relativePath, merge.merged, entry.newMode);
  report.merged.push({ path: relativePath, note: "changes from both sides combined" });
};

const writeState = (repo, statePath, report) => {
  const previous = readState(repo, statePath);
  const next = {
    ...previous,
    lastSyncedCommit: report.target,
    lastSyncedAt: new Date().toISOString(),
    lastSyncBase: report.base,
    lastSyncSource: report.baseSource,
  };

  const fullPath = path.join(repo, statePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, `${JSON.stringify(next, null, 2)}\n`);
};

const shortHash = (sha) => (typeof sha === "string" ? sha.slice(0, 7) : String(sha));

const TICK = String.fromCodePoint(96);

// Paths come from the template, but the report is the user-facing artifact:
// backticks, pipes and newlines would break the code span or the table.
const codeSpan = (value) => {
  const text = String(value)
    .replaceAll(/\s+/gu, " ")
    .replaceAll("|", String.raw`\|`);

  return text.includes(TICK) ? `${TICK}${TICK} ${text} ${TICK}${TICK}` : `${TICK}${text}${TICK}`;
};

const renderList = (lines, items, format) => {
  for (const item of items.slice(0, MAX_REPORTED_ITEMS)) lines.push(format(item));
  if (items.length > MAX_REPORTED_ITEMS)
    lines.push(`- …and ${items.length - MAX_REPORTED_ITEMS} more`);
};

const BASE_SOURCE_LABELS = {
  forced: "provided manually",
  heuristic: "auto-detected from your commit tree",
  "merge-base": "common ancestor with upstream",
  state: "recorded in `.github/sync-state.json`",
};

const renderReport = (report) => {
  const lines = [];
  const commitLink = (sha) => `[${shortHash(sha)}](${TEMPLATE_URL}/commit/${sha})`;
  const fileLink = (relativePath) =>
    `${TEMPLATE_URL}/blob/${report.target}/${relativePath
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/")}`;
  const applied =
    report.added.length + report.updated.length + report.deleted.length + report.merged.length;
  const review = report.conflicts.length + report.protected.length;

  lines.push("### 🔄 Upstream sync", "");
  lines.push(
    `Replays only what [${TEMPLATE_SLUG}](${TEMPLATE_URL}) changed since your last sync, ` +
      "and three-way merges every touched file so your own edits are never silently overwritten.",
    "",
  );
  lines.push("| | |", "| --- | --- |");
  lines.push(
    `| **Base** | \`${shortHash(report.base)}\` (${BASE_SOURCE_LABELS[report.baseSource] ?? report.baseSource}) |`,
  );
  lines.push(`| **Target** | ${commitLink(report.target)} |`);
  lines.push(`| **Applied** | ${applied} file(s) |`);
  lines.push(`| **Needs review** | ${review} file(s) |`, "");

  if (report.baseApproximate) {
    lines.push(
      "#### ⚠️ Base commit not confirmed",
      "",
      "The closest match was the oldest upstream commit scanned, so this sync may have skipped " +
        "template changes older than it. Nothing is lost yet: `.github/sync-state.json` keeps the " +
        "previous base, so you can replay the missing range by running the sync with an explicit base:",
      "",
      "```bash",
      "node .github/scripts/sync-upstream.mjs --base <last-synced-upstream-commit>",
      "```",
      "",
    );
  }

  const quiet =
    applied === 0 &&
    review === 0 &&
    report.keptDeleted.length === 0 &&
    report.symlinks.length === 0;

  if (quiet) {
    lines.push("Your repository already contains every upstream change. Nothing to do. 🎉");
  }

  if (report.added.length > 0 || report.updated.length > 0 || report.deleted.length > 0) {
    lines.push("#### ✅ Applied", "");
    renderList(lines, report.added, (file) => `- added ${codeSpan(file)}`);
    renderList(lines, report.updated, (file) => `- updated ${codeSpan(file)}`);
    renderList(lines, report.deleted, (file) => `- removed ${codeSpan(file)}`);
    lines.push("");
  }

  if (report.merged.length > 0) {
    lines.push("#### 🔀 Merged with your changes", "");
    renderList(lines, report.merged, ({ path: file, note }) => `- ${codeSpan(file)} — ${note}`);
    lines.push("");
  }

  if (report.conflicts.length > 0) {
    lines.push("#### ⚠️ Kept your version", "");
    lines.push(
      "These files changed both upstream and locally, so this PR keeps **your** content. " +
        "Compare the upstream version and merge by hand if you want the upstream change:",
      "",
    );
    renderList(
      lines,
      report.conflicts,
      ({ path: file, reason }) =>
        `- ${codeSpan(file)} — ${reason} ([upstream](<${fileLink(file)}>))`,
    );
    lines.push("");
  }

  if (report.protected.length > 0) {
    lines.push("#### 🛡️ Files that are never overwritten", "");
    lines.push(
      "These belong to your deployment, not to the template, so this PR leaves them untouched. " +
        "Copy anything from the upstream version that you want:",
      "",
    );
    renderList(lines, report.protected, ({ path: file, reason }) => {
      const note =
        reason === "workflow"
          ? "GitHub Actions cannot update workflow files — copy it manually if needed"
          : "instance file (config, README, license, asset, …) — kept as-is";

      return `- ${codeSpan(file)} — ${note} ([upstream](<${fileLink(file)}>))`;
    });
    lines.push("");
  }

  if (report.keptDeleted.length > 0) {
    lines.push("#### 🗑️ Still absent", "");
    renderList(
      lines,
      report.keptDeleted,
      (file) => `- ${codeSpan(file)} — you deleted it, so it is not restored`,
    );
    lines.push("");
  }

  if (report.symlinks.length > 0) {
    lines.push("#### 🔗 Symlinks skipped", "");
    renderList(lines, report.symlinks, (file) => `- ${codeSpan(file)}`);
    lines.push("");
  }

  if (report.packageJsonChanged) {
    lines.push(
      "> `pnpm-lock.yaml` is regenerated from the merged `package.json`; run `pnpm install` after merging to update your local `node_modules`.",
      "",
    );
  }

  lines.push(
    "---",
    "",
    `<sub>Generated by \`.github/scripts/sync-upstream.mjs\` · base ${shortHash(report.base)} · target ${shortHash(report.target)}</sub>`,
    "",
  );

  return `${lines.join("\n").trimEnd()}\n`;
};

const parseArgs = (argv) => {
  const options = {
    depth: DEFAULT_DEPTH,
    help: false,
    repo: process.cwd(),
    state: DEFAULT_STATE_PATH,
    upstream: "upstream/main",
  };

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    const nextValue = () => {
      index += 1;
      const value = argv[index];

      if (value === undefined) throw new Error(`Missing value for ${argument}`);

      return value;
    };

    switch (argument) {
      case "--repo": {
        options.repo = nextValue();
        break;
      }
      case "--upstream": {
        options.upstream = nextValue();
        break;
      }
      case "--base": {
        options.base = nextValue();
        break;
      }
      case "--depth": {
        const depth = Number.parseInt(nextValue(), 10);

        if (!Number.isInteger(depth) || depth < 1)
          throw new Error("--depth must be a positive integer");
        options.depth = depth;
        break;
      }
      case "--state": {
        options.state = nextValue();
        break;
      }
      case "--report": {
        options.report = nextValue();
        break;
      }
      case "--summary": {
        options.summary = nextValue();
        break;
      }
      case "--dry-run": {
        options.dryRun = true;
        break;
      }
      case "--help":
      case "-h": {
        options.help = true;
        break;
      }
      default: {
        throw new Error(`Unknown argument: ${argument}`);
      }
    }
  }

  return options;
};

const printUsage = () => {
  process.stdout.write(
    [
      "Usage: node .github/scripts/sync-upstream.mjs [options]",
      "",
      "  --repo <dir>       repository to sync (default: current directory)",
      "  --upstream <ref>   upstream ref to sync from (default: upstream/main)",
      "  --base <sha>       force the base commit instead of detecting it",
      "  --depth <n>        how many upstream commits to scan for the base (default: 300)",
      "  --state <path>     sync state file (default: .github/sync-state.json)",
      "  --report <file>    write the Markdown pull request body to this file",
      "  --summary <file>   write a JSON summary to this file",
      "  --dry-run          report what would change without touching files",
      "  --help             show this help",
      "",
    ].join("\n"),
  );
};

const run = (options) => {
  const repo = path.resolve(options.repo);
  const log = (message) => process.stdout.write(`${message}\n`);
  const upstreamRef = options.upstream;
  const target = revParse(repo, upstreamRef);

  if (!target) {
    throw new Error(
      `Cannot resolve "${upstreamRef}". Fetch upstream first, e.g.\n` +
        `  git remote add upstream ${TEMPLATE_URL}.git\n` +
        `  git fetch upstream main`,
    );
  }

  const state = readState(repo, options.state);
  let base;

  if (options.base) {
    if (!revParse(repo, options.base)) throw new Error(`--base ${options.base} does not exist`);
    if (!isAncestor(repo, options.base, target))
      throw new Error(`--base ${options.base} is not an ancestor of ${upstreamRef}`);

    base = { sha: revParse(repo, options.base), source: "forced", approximate: false };
    log(`[base] forced by --base (${base.sha.slice(0, 7)})`);
  } else {
    base = findBaseCommit({
      repo,
      upstreamRef,
      target,
      depth: options.depth,
      state,
      log,
    });
  }

  log(`[target] ${upstreamRef} = ${target.slice(0, 7)}`);

  const report = createReport(base.sha, target, base);
  const context = {
    repo,
    report,
    dryRun: Boolean(options.dryRun),
    isProtected: protectMatcher(state),
  };

  const entries = parseRawDiff(repo, base.sha, target);

  for (const entry of entries) syncEntry(context, entry);

  const changed =
    report.added.length +
      report.updated.length +
      report.deleted.length +
      report.merged.length +
      report.conflicts.length +
      report.protected.length +
      report.keptDeleted.length +
      report.symlinks.length >
    0;

  // An unconfirmed base is never recorded: it would make the skipped commits
  // unreachable for every later run.
  if (changed && !report.baseApproximate && !options.dryRun)
    writeState(repo, options.state, report);

  const summary = {
    base: report.base,
    baseSource: report.baseSource,
    baseApproximate: report.baseApproximate,
    target: report.target,
    changed,
    added: report.added,
    updated: report.updated,
    deleted: report.deleted,
    merged: report.merged.map((item) => item.path),
    conflicts: report.conflicts,
    protected: report.protected,
    keptDeleted: report.keptDeleted,
    symlinks: report.symlinks,
    packageJsonChanged: report.packageJsonChanged,
  };

  const markdown = renderReport(report);

  if (options.report) fs.writeFileSync(path.resolve(options.report), markdown);
  if (options.summary)
    fs.writeFileSync(path.resolve(options.summary), `${JSON.stringify(summary, null, 2)}\n`);

  const stepSummary = process.env.GITHUB_STEP_SUMMARY;

  if (stepSummary) fs.appendFileSync(stepSummary, markdown);

  // Expose the two facts the workflow gates on, without forcing it to parse JSON.
  const githubOutput = process.env.GITHUB_OUTPUT;

  if (githubOutput) {
    fs.appendFileSync(
      githubOutput,
      `changed=${changed}\npackage_json_changed=${report.packageJsonChanged}\n`,
    );
  }

  log(
    `[sync] base ${shortHash(report.base)} (${report.baseSource}) → target ${shortHash(report.target)}: ` +
      `${summary.added.length} added, ${summary.updated.length} updated, ${summary.deleted.length} removed, ` +
      `${summary.merged.length} merged, ${summary.conflicts.length} kept, ${summary.protected.length} protected, ` +
      `${summary.keptDeleted.length} left deleted, ${summary.symlinks.length} symlinks skipped`,
  );

  if (report.baseApproximate)
    log("[sync] the base commit is unconfirmed — the sync state was left untouched");

  if (!changed) log("[sync] nothing to sync");

  return summary;
};

const main = () => {
  let options;

  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n\n`);
    printUsage();
    process.exitCode = 2;

    return;
  }

  if (options.help) {
    printUsage();

    return;
  }

  try {
    run(options);
  } catch (error) {
    process.stderr.write(`[sync] ${error?.message ?? error}\n`);
    process.exitCode = 1;
  }
};

const realPath = (target) => {
  try {
    return fs.realpathSync(target);
  } catch {
    return null;
  }
};

// Compare real paths: a symlinked checkout or `/tmp` entry point would otherwise
// make the CLI exit silently without doing anything.
const invokedDirectly =
  typeof process.argv[1] === "string" &&
  realPath(process.argv[1]) === realPath(import.meta.filename);

if (invokedDirectly) main();

export {
  DEFAULT_PROTECTED,
  countConflictMarkers,
  deepEqual,
  globToRegExp,
  mergePackageJson,
  parseRawDiff,
  renderReport,
  threeWayMerge,
};
