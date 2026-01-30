// oxlint-disable no-console
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import type { Plugin, ResolvedConfig } from "vite";
import { build } from "vite";

import { loadConfig } from "./configLoader.js";
import type { Config } from "../src/types/index.js";

const handleCloseBundle = async (root: string, viteConfig: ResolvedConfig): Promise<void> => {
  if (viteConfig.build.ssr !== false) return;

  const { outDir } = viteConfig.build;
  const serverOutDir = join(outDir, "server");

  console.log("Building server entry...");

  await build({
    root: viteConfig.root,
    configFile: viteConfig.configFile,
    build: {
      ssr: "entry-server.tsx",
      outDir: serverOutDir,
      emptyOutDir: true,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
          warn(warning);
        },
      },
    },
  });

  console.log("Prerendering...");

  const appConfig = await loadConfig(root);
  const routesToPrerender = Object.keys(appConfig.locales);

  const serverEntryPath = resolve(serverOutDir, "entry-server.js");
  const { render } = (await import(serverEntryPath)) as {
    render: (url: string, config: Config) => string;
  };

  const templatePath = resolve(outDir, "index.html");
  const template = readFileSync(templatePath, "utf8");

  for (const url of routesToPrerender) {
    const appHtml = render(url, appConfig);

    let html = template.replace(`<!--app-html-->`, appHtml);

    const title = appConfig.locales[url]?.title ?? "Portfolio";
    const description = appConfig.locales[url].description ?? "Portfolio Template";
    const { lang } = appConfig.locales[url];

    html = html
      .replace(
        /<title>(.*?)<\/title>/,
        `<title>${title}</title>\n    <meta name="description" content="${description}" />`,
      )
      .replace(/<html lang="(.*?)">/, `<html lang="${lang}">`);

    const filePath =
      url === "/"
        ? join(outDir, "index.html")
        : join(outDir, url.endsWith("/") ? `${url}index.html` : `${url}/index.html`);

    const dir = dirname(filePath);

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
