import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { ModuleNode, Plugin, ViteDevServer } from "vite";
import { defineConfig } from "vite";

import { CONFIG_FILES, getConfigDependencies, loadConfig } from "./lib/configLoader.js";
import { ssgPlugin } from "./lib/ssgPlugin.js";

// oxlint-disable-next-line unicorn/prefer-import-meta-properties -- `import.meta.dirname` resolves to Vite's temp bundle dir (`node_modules/.vite-temp`), not the project root. `import.meta.url` is rewritten by Vite to the original config file URL, so this is the only reliable way to get the root.
const rootDir = fileURLToPath(new URL(".", import.meta.url));

const injectCustomCssImportPlugin = ({
  customCSS = "../custom.css",
  entry = "index.css",
} = {}): Plugin => {
  let root = "";
  let indexCssPath = "";
  let customCssPath = "";

  return {
    name: "inject-custom-css",
    enforce: "pre",

    configResolved(config) {
      ({ root } = config);
      indexCssPath = path.resolve(root, entry).replaceAll("\\", "/");
      customCssPath = path.resolve(root, customCSS).replaceAll("\\", "/");
    },

    transform(code: string, id: string): { code: string; map: null } | null {
      const cleanId = id.split("?")[0].replaceAll("\\", "/");

      if (cleanId === indexCssPath) {
        this.addWatchFile(customCssPath);

        if (fs.existsSync(customCssPath)) {
          const relativePath = path.posix.relative(path.posix.dirname(indexCssPath), customCssPath);

          return {
            code: `${code}\n@import '${relativePath}';`,
            map: null,
          };
        }
      }

      return null;
    },

    // oxlint-disable-next-line typescript/consistent-return
    handleHotUpdate({ file, server }): ModuleNode[] | undefined {
      const cleanFile = file.replaceAll("\\", "/");

      if (cleanFile === customCssPath) {
        const indexModules = server.moduleGraph.getModulesByFile(indexCssPath);
        if (indexModules && indexModules.size > 0) return [...indexModules];
      }
    },
  };
};

export default defineConfig(async () => {
  const config = await loadConfig(rootDir);

  return {
    root: path.resolve(rootDir, "src"),

    build: {
      outDir: path.resolve(rootDir, "dist"),
      emptyOutDir: true,
    },

    publicDir: path.resolve(rootDir, "public"),

    define: {
      __CONFIG__: JSON.stringify(config),
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [
      react(),
      injectCustomCssImportPlugin(),
      tailwindcss(),
      ssgPlugin(rootDir),
      {
        name: "inject-title-and-meta",
        transformIndexHtml(html: string): string {
          const localeConfig = config.locales;
          const locales = Object.keys(localeConfig);
          const [defaultLocale] = locales;

          const title = localeConfig[defaultLocale].title ?? "Portfolio";
          const description = localeConfig[defaultLocale].description ?? "Portfolio Template";

          return html.replace(
            /<title>(?:.*?)<\/title>/u,
            `<title>${title}</title>\n    <meta name="description" content="${description}" />`,
          );
        },
      },
      {
        name: "watch-config",
        configureServer(server: ViteDevServer): void {
          const configPath = path.resolve(rootDir, "config");
          const configDependencies = getConfigDependencies(rootDir);

          server.watcher.add(configPath);
          server.watcher.add(CONFIG_FILES.map((filePath) => path.resolve(rootDir, filePath)));
          server.watcher.add(configDependencies);

          server.watcher.on("change", (file: string) => {
            if (
              file.startsWith(configPath) ||
              CONFIG_FILES.some((filePath) => file === path.resolve(rootDir, filePath)) ||
              configDependencies.includes(file)
            )
              void server.restart();
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "."),
      },
    },
  };
});
