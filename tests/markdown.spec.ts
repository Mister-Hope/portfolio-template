import type { PluginSimple } from "@mdit/helper";
import { describe, expect, it } from "vitest";

import { createMarkdownRenderer } from "../lib/markdown.js";

describe(createMarkdownRenderer, () => {
  it("renders standard Markdown and inline Markdown", async () => {
    const render = await createMarkdownRenderer();

    expect(render("")).toBe("");
    expect(render("Hello **world**")).toBe("<p>Hello <strong>world</strong></p>\n");
    expect(render("Hello *world*", true)).toBe("Hello <em>world</em>");
  });

  it("adds target and rel attributes to external links while preserving internal links", async () => {
    const render = await createMarkdownRenderer();

    const externalHtml = render("[External](https://example.com)");

    expect(externalHtml).toContain('href="https://example.com"');
    expect(externalHtml).toContain('target="_blank"');
    expect(externalHtml).toContain('rel="noopener noreferrer"');

    const internalHtml = render("[Internal](/about)");

    expect(internalHtml).toContain('href="/about"');
    expect(internalHtml).not.toContain("target=");
    expect(internalHtml).not.toContain("rel=");
  });

  it("supports function-form mdIt configuration", async () => {
    const customPlugin: PluginSimple = (md) => {
      md.renderer.rules.strong_open = (): string => '<strong class="custom">';
    };

    const render = await createMarkdownRenderer((md: Parameters<PluginSimple>[0]) => {
      md.use(customPlugin);
    });

    expect(render("Hello **world**", true)).toBe('Hello <strong class="custom">world</strong>');
  });

  it("rejects relative paths, absolute paths, URLs, Windows paths, and backslashes", async () => {
    const invalidSpecifiers = [
      "../evil.js",
      "./evil.js",
      "/tmp/evil.js",
      "~/evil.js",
      "file:///tmp/evil.js",
      "node:fs",
      "data:text/javascript,export default () => {}",
      String.raw`C:\evil.js`,
      "C:/evil.js",
      String.raw`foo\bar`,
      "foo/../bar",
    ];

    await Promise.all(
      invalidSpecifiers.map((specifier) =>
        expect(createMarkdownRenderer([specifier])).rejects.toThrow(
          `Invalid markdown-it plugin specifier "${specifier}": only npm package names are allowed`,
        ),
      ),
    );
  });

  it("rejects modules whose resolved export is not a function", async () => {
    await expect(createMarkdownRenderer(["js-yaml"])).rejects.toThrow(
      /Failed to load markdown-it plugin "js-yaml":.*did not resolve to a function/u,
    );
  });
});
