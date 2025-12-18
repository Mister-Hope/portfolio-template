import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { ViteDevServer } from "vite";
import { defineConfig } from "vite";

import {
  configFiles,
  getConfigDependencies,
  loadConfig,
} from "./lib/configLoader.js";
import { ssgPlugin } from "./lib/ssgPlugin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __CONFIG__: JSON.stringify(config),
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [
      react(),
      tailwindcss({}),
      ssgPlugin(__dirname),
      {
        name: "inject-title-and-meta",
        transformIndexHtml(html: string): string {
          const localeConfig = config.locales;
          const locales = Object.keys(localeConfig);
          const defaultLocale = locales[0];

          const title = localeConfig[defaultLocale].title ?? "Portfolio";
          const description =
            localeConfig[defaultLocale].description ?? "Portfolio Template";

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
          server.watcher.add(
            configFiles.map((f) => path.resolve(__dirname, f)),
          );
          server.watcher.add(configDependencies);

          server.watcher.on("change", (file: string) => {
            if (
              file.startsWith(configPath) ||
              configFiles.some((f) => file === path.resolve(__dirname, f)) ||
              configDependencies.includes(file)
            ) {
              void server.restart();
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
