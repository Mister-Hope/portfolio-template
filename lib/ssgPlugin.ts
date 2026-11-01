import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { Plugin, ResolvedConfig } from "vite";
import { build } from "vite";

import type { Config } from "../src/types/index.js";
import { loadConfig } from "./configLoader.js";
import { escapeHtml } from "./escapeHtml.js";

const handleCloseBundle = async (root: string, viteConfig: ResolvedConfig): Promise<void> => {
  if (viteConfig.build.ssr !== false) return;

  const { outDir } = viteConfig.build;
  const serverOutDir = path.join(outDir, "server");

  console.log("Building server entry...");

  await build({
    root: viteConfig.root,
    configFile: viteConfig.configFile,
    // Inherit the *resolved* base and mode: the CLI may override them (e.g. `--base`), and the
    // nested build re-evaluates `vite.config.ts`, which would otherwise fall back to the config
    // file value. A mismatch here means the prerendered HTML and the client bundle disagree.
    base: viteConfig.base,
    mode: viteConfig.mode,
    build: {
      ssr: "entry-server.tsx",
      outDir: serverOutDir,
      emptyOutDir: true,
      rolldownOptions: {
        onLog(level, log, defaultHandler) {
          if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
          defaultHandler(level, log);
        },
      },
    },
  });

  console.log("Prerendering...");

  const appConfig = await loadConfig(root);
  const routesToPrerender = Object.keys(appConfig.locales);

  const serverEntryPath = path.resolve(serverOutDir, "entry-server.js");
  const { render } = (await import(serverEntryPath)) as {
    render: (url: string, config: Config) => string;
  };

  const templatePath = path.resolve(outDir, "index.html");
  const template = readFileSync(templatePath, "utf-8");

  for (const url of routesToPrerender) {
    const appHtml = render(url, appConfig);

    // Use a function replacer: `appHtml` may contain `$&`/`$'`/`$\`` sequences (ordinary
    // Markdown code can), which would otherwise be interpreted as replacement patterns.
    let html = template.replace("<!--app-html-->", () => appHtml);

    const title = appConfig.locales[url]?.title ?? "Portfolio";
    const description = appConfig.locales[url].description ?? "Portfolio Template";
    const { lang } = appConfig.locales[url];

    const metaDescription = `<meta name="description" content="${escapeHtml(description)}" />`;

    html = html
      // Drop the default-locale description injected by the Vite plugin: every page must
      // contain exactly one `<meta name="description">`, localized for its own route.
      .replace(/<meta name="description"[^>]*\/>\s*/u, "")
      .replace(
        /<title>(?:.*?)<\/title>/u,
        () => `<title>${escapeHtml(title)}</title>\n    ${metaDescription}`,
      )
      .replace(/<html lang="(?:.*?)">/u, () => `<html lang="${escapeHtml(lang)}">`);

    const filePath =
      url === "/"
        ? path.join(outDir, "index.html")
        : path.join(outDir, url.endsWith("/") ? `${url}index.html` : `${url}/index.html`);

    const dir = path.dirname(filePath);

    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, html);
    console.log(`  ${url} -> ${filePath}`);
  }

  console.log("Cleaning up server build...");
  rmSync(serverOutDir, { recursive: true, force: true });
  console.log("SSG complete.");
};

export const ssgPlugin = (root: string): Plugin => {
  let viteConfig: ResolvedConfig;

  return {
    name: "vite-plugin-ssg",
    apply: "build",
    configResolved(config): void {
      viteConfig = config;
    },
    async closeBundle(): Promise<void> {
      await handleCloseBundle(root, viteConfig);
    },
  };
};
