// oxlint-disable max-depth
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { createJiti } from "jiti";
import { load } from "js-yaml";

import { resolveConfig } from "./resolveConfig.js";
import type { Config } from "../src/types/index.js";

const require = createRequire(import.meta.url);

export const configFiles = ["config.ts", "config.js", "config.yml", "config.yaml", "config.json"];

export const loadConfig = async (root: string): Promise<Config> => {
  let config: Config | null = null;

  for (const file of configFiles) {
    const filePath = path.resolve(root, file);

    if (fs.existsSync(filePath)) {
      try {
        if (file.endsWith(".json")) {
          const content = fs.readFileSync(filePath, "utf8");

          config = JSON.parse(content) as Config;
        } else if (file.endsWith(".yml") || file.endsWith(".yaml")) {
          const content = fs.readFileSync(filePath, "utf8");

          config = load(content) as Config;
        } else {
          // Clear require cache
          try {
            const dependencies = getConfigDependencies(root);

            for (const dep of dependencies) delete require.cache[dep];

            delete require.cache[filePath];
          } catch {
            // Ignore errors clearing cache
          }

          const jiti = createJiti(import.meta.url, {
            // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-assignment
            fsCache: false as any,
            // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-assignment
            moduleCache: false as any,
          });
          // oxlint-disable-next-line no-await-in-loop
          const mod = await jiti.import(filePath);

          config = (mod as { default: Config }).default;
          break;
        }
      } catch (err) {
        throw new Error(`Error parsing ${file}: ${String(err)}`, { cause: err });
      }
    }
  }

  if (!config) {
    throw new Error(
      "No configuration file found. Please create one of the following files: config.ts, config.js, config.json, config.yml, config.yaml",
    );
  }

  return resolveConfig(config);
};

const getImports = (filePath: string): string[] => {
  const content = fs.readFileSync(filePath, "utf8");
  const imports: string[] = [];
  const regex = /(?:import|export)(?:[\s\S]*?from\s+|\s+)['"](\.[^'"]+)['"]/g;
  let match;

  while ((match = regex.exec(content)) !== null) imports.push(match[1]);

  return imports;
};

const resolveImport = (basePath: string, importPath: string): string | null => {
  if (!importPath.startsWith(".")) return null;

  const extensions = ["", ".ts", ".js", ".tsx", ".jsx", ".json"];
  const resolvePath = path.resolve(basePath, importPath);

  for (const ext of extensions) {
    const filePath = resolvePath + ext;

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return filePath;
  }

  // Handle .js -> .ts mapping
  if (resolvePath.endsWith(".js")) {
    const tsPath = resolvePath.replace(/\.js$/, ".ts");

    if (fs.existsSync(tsPath) && fs.statSync(tsPath).isFile()) return tsPath;
  }

  return null;
};

export const getConfigDependencies = (root: string): string[] => {
  const dependencies = new Set<string>();
  let entryFile = "";

  for (const file of configFiles) {
    const filePath = path.resolve(root, file);

    if (fs.existsSync(filePath)) {
      entryFile = filePath;
      break;
    }
  }

  if (!entryFile) return [];

  const queue = [entryFile];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const currentFile = queue.shift();

    if (!currentFile || visited.has(currentFile)) continue;
    visited.add(currentFile);
    dependencies.add(currentFile);

    // Only parse JS/TS files
    if (!/\.(js|ts|jsx|tsx|mjs|cjs)$/.test(currentFile)) continue;

    try {
      const imports = getImports(currentFile);
      const dir = path.dirname(currentFile);

      for (const imp of imports) {
        const resolved = resolveImport(dir, imp);

        if (resolved && !resolved.includes("node_modules")) queue.push(resolved);
      }
    } catch {
      // Ignore errors reading files
    }
  }

  return [...dependencies];
};
