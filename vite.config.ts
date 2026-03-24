import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Plugin, ViteDevServer } from "vite";
import { defineConfig } from "vite";

import { CONFIG_FILES, getConfigDependencies, loadConfig } from "./lib/configLoader.js";
import { ssgPlugin } from "./lib/ssgPlugin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const customCssPlugin = (): Plugin => {
  const customCssPath = path.resolve(__dirname, "custom.css");
  const indexCssPath = path.resolve(__dirname, "src/index.css");
  let cachedCustomCss: string | null = null;

  const readCustomCss = (): string | null => {
    if (!fs.existsSync(customCssPath)) return null;

    cachedCustomCss ??= fs.readFileSync(customCssPath, "utf-8");
    return cachedCustomCss;
  };

  return {
    name: "inject-custom-css",
    enforce: "pre",
    transform(code: string, id: string): { code: string } | null {
      const customCss = id.split("?")[0] === indexCssPath ? readCustomCss() : null;

      return customCss ? { code: `${code}\n${customCss}` } : null;
    },
    configureServer(server: ViteDevServer): void {
      // Watch the file even if it does not exist yet so creation is detected
      server.watcher.add(customCssPath);
      server.watcher.on("change", (file: string) => {
        if (file === customCssPath) {
          cachedCustomCss = null;
          const module = server.moduleGraph.getModuleById(indexCssPath);

          if (module) void server.reloadModule(module);
        }
      });
    },
  };
};

export default defineConfig(async () => {
  const config = await loadConfig(__dirname);

  return {
    root: path.resolve(__dirname, "src"),

    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
    },

    publicDir: path.resolve(__dirname, "public"),

    define: {
      __CONFIG__: JSON.stringify(config),
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [
      react(),
      tailwindcss(),
      customCssPlugin(),
      ssgPlugin(__dirname),
      {
        name: "inject-title-and-meta",
        transformIndexHtml(html: string): string {
          const localeConfig = config.locales;
          const locales = Object.keys(localeConfig);
          const [defaultLocale] = locales;

          const title = localeConfig[defaultLocale].title ?? "Portfolio";
          const description = localeConfig[defaultLocale].description ?? "Portfolio Template";

          return html.replace(
            /<title>(.*?)<\/title>/,
            `<title>${title}</title>\n    <meta name="description" content="${description}" />`,
          );
        },
      },
      {
        name: "watch-config",
        configureServer(server: ViteDevServer): void {
          const configPath = path.resolve(__dirname, "config");
          const configDependencies = getConfigDependencies(__dirname);

          server.watcher.add(configPath);
          server.watcher.add(CONFIG_FILES.map((filePath) => path.resolve(__dirname, filePath)));
          server.watcher.add(configDependencies);

          server.watcher.on("change", (file: string) => {
            if (
              file.startsWith(configPath) ||
              CONFIG_FILES.some((filePath) => file === path.resolve(__dirname, filePath)) ||
              configDependencies.includes(file)
            )
              void server.restart();
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
