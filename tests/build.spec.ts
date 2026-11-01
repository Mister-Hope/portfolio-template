import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const CONFIG_EXTENSIONS = ["ts", "js", "json", "yml", "yaml"];

const examplePath = (extension: string): string =>
  path.join(root, "examples", `config.example.${extension}`);

const configPath = (extension: string): string => path.join(root, `config.${extension}`);

const distPath = (...segments: string[]): string => path.join(root, "dist", ...segments);

const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");

const clearConfigs = (): void => {
  for (const extension of CONFIG_EXTENSIONS) fs.rmSync(configPath(extension), { force: true });
};

const writeConfig = (extension: string, content: string): void => {
  clearConfigs();
  fs.writeFileSync(configPath(extension), content);
};

const readJsonExample = (): Record<string, unknown> =>
  JSON.parse(fs.readFileSync(examplePath("json"), "utf-8")) as Record<string, unknown>;

const runBuild = (): void => {
  execFileSync(process.execPath, [viteBin, "build"], { cwd: root, stdio: "pipe" });
};

const runBuildExpectingError = (): string => {
  try {
    runBuild();
  } catch (err) {
    const { stderr } = err as { stderr?: Buffer };

    return `${String(err)}${stderr?.toString() ?? ""}`;
  }

  throw new Error("Expected the build to fail, but it succeeded");
};

const readDist = (relativePath: string): string => fs.readFileSync(distPath(relativePath), "utf-8");

const countOccurrences = (haystack: string, needle: string): number =>
  haystack.split(needle).length - 1;

describe("example configs", () => {
  it("builds every supported config format", () => {
    for (const extension of ["yml", "json", "js", "ts"]) {
      clearConfigs();
      fs.copyFileSync(examplePath(extension), configPath(extension));
      runBuild();

      const html = readDist("index.html");

      expect(html).toContain("<title>Mister-Hope | Portfolio</title>");
      expect(countOccurrences(html, 'name="description"')).toBe(1);
      expect(html).not.toContain("<!--app-html-->");
      // Icon placeholders are sized during SSR so icons do not cause layout shift.
      expect(html).toContain("width:1em");
      expect(fs.existsSync(distPath("zh", "index.html"))).toBe(true);
    }
  }, 240_000);
});

describe("prerender safety", () => {
  it("escapes config strings in title and description", () => {
    const config = readJsonExample();
    const locales = config.locales as Record<string, Record<string, unknown>>;

    locales["/"].title = 'Evil "quote" </title><script>alert(1)</script>';
    locales["/"].description = 'He said "hi" & <b>bold</b>';
    writeConfig("json", JSON.stringify(config));
    runBuild();

    const html = readDist("index.html");

    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;/title&gt;");
    expect(countOccurrences(html, 'name="description"')).toBe(1);
  }, 120_000);

  it("does not interpret `$` sequences in Markdown", () => {
    const config = readJsonExample();
    const locales = config.locales as Record<string, { sections: unknown[] }>;

    locales["/"].sections.push({
      type: "markdown",
      id: "probe",
      title: "Probe",
      data: { content: "printf $'\\n' and `$` and $$x$$ and $& end" },
    });
    writeConfig("json", JSON.stringify(config));
    runBuild();

    const html = readDist("index.html");

    expect(countOccurrences(html, "</html>")).toBe(1);
    expect(countOccurrences(html, "<head>")).toBe(1);
    expect(html).toContain("printf $");
  }, 120_000);

  it("supports a sub-path base", () => {
    const config = readJsonExample();

    config.base = "/repo/";
    writeConfig("json", JSON.stringify(config));
    runBuild();

    const html = readDist("index.html");

    expect(html).toContain('src="/repo/assets/');
    expect(html).toContain('src="/repo/avatar.avif"');
  }, 120_000);

  it("emits SEO files when siteUrl is set", () => {
    const config = readJsonExample();

    config.siteUrl = "https://example.com";
    writeConfig("json", JSON.stringify(config));
    runBuild();

    expect(readDist("index.html")).toContain(
      '<link rel="canonical" href="https://example.com/" />',
    );
    expect(fs.existsSync(distPath("sitemap.xml"))).toBe(true);
    expect(readDist("robots.txt")).toContain("Sitemap: https://example.com/sitemap.xml");
  }, 120_000);
});

describe("config validation", () => {
  it("reports unknown top-level keys", () => {
    const config = readJsonExample();

    config.unknownKey = true;
    writeConfig("json", JSON.stringify(config));

    expect(runBuildExpectingError()).toContain("Invalid configuration");
  }, 120_000);

  it("requires a root locale", () => {
    const config = readJsonExample();
    const locales = config.locales as Record<string, unknown>;

    config.locales = { "/zh/": locales["/zh/"] };
    writeConfig("json", JSON.stringify(config));

    expect(runBuildExpectingError()).toContain('root locale with the key "/"');
  }, 120_000);

  it("reports a missing config file", () => {
    clearConfigs();
    expect(runBuildExpectingError()).toContain("No configuration file found");
  }, 120_000);
});

describe("static extras", () => {
  it("emits a 404 page, default favicon and resolved $year", () => {
    clearConfigs();
    const config = readJsonExample();
    const locales = config.locales as Record<string, Record<string, unknown>>;

    locales["/"].footer = { copyright: "© $year Test" };
    writeConfig("json", JSON.stringify(config));
    runBuild();

    const index = readDist("index.html");
    const notFound = readDist("404.html");

    expect(index).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />');
    expect(index).toContain(`© ${new Date().getFullYear()} Test`);
    expect(index).not.toContain("$year");
    expect(notFound).toContain('name="robots" content="noindex"');
    expect(notFound).toContain('href="/"');
    expect(fs.existsSync(distPath("favicon.svg"))).toBe(true);
  }, 120_000);

  it("prefixes the favicon and the 404 home link with base", () => {
    clearConfigs();
    const config = readJsonExample();

    config.base = "/repo/";
    writeConfig("json", JSON.stringify(config));
    runBuild();

    expect(readDist("index.html")).toContain('rel="icon" href="/repo/favicon.svg"');
    expect(readDist("404.html")).toContain('href="/repo/"');
  }, 120_000);

  it("uses ogImage for social tags when siteUrl is set", () => {
    clearConfigs();
    const config = readJsonExample();

    config.siteUrl = "https://example.com";
    config.ogImage = "/social.png";
    writeConfig("json", JSON.stringify(config));
    runBuild();

    const html = readDist("index.html");

    expect(html).toContain('<meta property="og:image" content="https://example.com/social.png" />');
    expect(html).toContain(
      '<meta name="twitter:image" content="https://example.com/social.png" />',
    );
  }, 120_000);

  it("supports a custom absolute favicon and disabling the tag", () => {
    clearConfigs();
    const config = readJsonExample();

    config.favicon = "https://cdn.example.com/icon.png";
    writeConfig("json", JSON.stringify(config));
    runBuild();

    expect(readDist("index.html")).toContain('rel="icon" href="https://cdn.example.com/icon.png"');

    clearConfigs();
    const disabled = readJsonExample();

    disabled.favicon = "";
    writeConfig("json", JSON.stringify(disabled));
    runBuild();

    expect(readDist("index.html")).not.toContain('rel="icon"');

    clearConfigs();
  }, 240_000);
});
