import fs from "node:fs";
import path from "node:path";

import Ajv from "ajv";
import type { ValidateFunction } from "ajv";
import { load } from "js-yaml";
import { unrun } from "unrun";

import type { Config } from "../src/types/index.js";
import { resolveConfig } from "./resolveConfig.js";

export const CONFIG_FILES = ["config.ts", "config.js", "config.yml", "config.yaml", "config.json"];

interface ConfigCacheEntry {
  configPath: string;
  dependencies: string[];
  signature: string;
  config?: Config;
  promise?: Promise<Config>;
}

const CONFIG_CACHE_KEY = Symbol.for("portfolio-template:config-cache");

/**
 * Retrieve the process-wide config cache stored on `globalThis`.
 *
 * Kept on `globalThis` rather than a module variable because Vite may bundle and evaluate
 * `vite.config.ts` (and its imports) more than once in the same process (e.g. client build + SSR
 * build).
 *
 * 获取保存在 `globalThis` 上的进程级配置缓存。
 *
 * @returns Map keyed by resolved project root directory
 */
const getConfigCache = (): Map<string, ConfigCacheEntry> => {
  const globalStore = globalThis as typeof globalThis & {
    [CONFIG_CACHE_KEY]?: Map<string, ConfigCacheEntry>;
  };

  globalStore[CONFIG_CACHE_KEY] ??= new Map<string, ConfigCacheEntry>();

  return globalStore[CONFIG_CACHE_KEY];
};

/**
 * Compute a deterministic file-state signature for a set of file paths based on mtime and byte
 * size.
 *
 * 根据文件的修改时间与字节大小计算确定性的状态签名。
 *
 * @param files - Absolute file paths to stat
 * @returns Signature string
 */
const computeFilesSignature = (files: readonly string[]): string =>
  files
    .map((file) => {
      try {
        const stat = fs.statSync(file);

        return `${file}:${stat.mtimeMs}:${stat.size}`;
      } catch {
        return `${file}:missing`;
      }
    })
    .join("|");

const schemaCache = new Map<string, ValidateFunction>();

/**
 * Find the first existing config file, following `CONFIG_FILES` order.
 *
 * 按 `CONFIG_FILES` 顺序找到第一个存在的配置文件。
 *
 * @param root - Project root directory
 * @returns Absolute config file path, or `null`
 */
const findConfigFile = (root: string): string | null => {
  for (const file of CONFIG_FILES) {
    const filePath = path.resolve(root, file);

    if (fs.existsSync(filePath)) return filePath;
  }

  return null;
};

/**
 * Local files the current config depends on (watched by the dev server).
 *
 * Populated by `loadConfig` from unrun's dependency list; falls back to the config file itself.
 *
 * 当前配置依赖的本地文件（用于 dev server 监听），由 `loadConfig` 通过 unrun 的依赖列表填充。
 *
 * @param root - Project root directory
 * @returns Absolute file paths
 */
export const getConfigDependencies = (root: string): string[] => {
  const rootKey = path.resolve(root);
  const cached = getConfigCache().get(rootKey);

  if (cached && cached.dependencies.length > 0) return cached.dependencies;

  const filePath = findConfigFile(rootKey);

  return filePath ? [filePath] : [];
};

/**
 * Lazily compile the shipped JSON Schema for runtime validation.
 *
 * 惰性编译仓库内的 JSON Schema，用于运行时校验。
 *
 * @param root - Project root directory
 * @returns Compiled validator, or `null` when the schema file is missing
 */
const getValidator = (root: string): ValidateFunction | null => {
  const schemaPath = path.resolve(root, "lib/config.schema.json");
  const cached = schemaCache.get(schemaPath);

  if (cached) return cached;
  if (!fs.existsSync(schemaPath)) return null;

  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8")) as object;
    const validate = new Ajv({ allErrors: true, strict: false }).compile(schema);

    schemaCache.set(schemaPath, validate);

    return validate;
  } catch (err) {
    throw new Error(`Failed to load config schema at ${schemaPath}: ${String(err)}`, {
      cause: err,
    });
  }
};

/**
 * Turn AJV errors into a readable, multi-line message.
 *
 * 将 AJV 错误格式化为可读的多行信息。
 *
 * @param errors - AJV validation errors
 * @returns Formatted error details
 */
const formatValidationErrors = (errors: ValidateFunction["errors"]): string => {
  if (errors == null || errors.length === 0) return "  - unknown validation error";

  return errors
    .map((error) => {
      const location = error.instancePath || "/";
      const { params } = error;

      return `  - ${location}: ${error.message ?? "invalid value"}${
        Object.keys(params).length > 0 ? ` (${JSON.stringify(params)})` : ""
      }`;
    })
    .join("\n");
};

/**
 * Validate the raw config object against the shipped JSON Schema.
 *
 * 使用仓库内的 JSON Schema 校验原始配置对象。
 *
 * @param config - Parsed config object
 * @param root - Project root directory
 * @param configPath - Absolute path of the config file (for error messages)
 * @returns The validated config
 */
const validateConfig = (config: unknown, root: string, configPath: string): Config => {
  const validate = getValidator(root);

  if (!validate) return config as Config;
  if (validate(config)) return config as Config;

  throw new Error(
    `Invalid configuration in ${path.basename(configPath)} (${configPath}):\n${formatValidationErrors(
      validate.errors,
    )}`,
  );
};

/**
 * Parse a config file. TS/JS files are bundled and evaluated with unrun.
 *
 * 解析配置文件；TS/JS 配置由 unrun 打包执行。
 *
 * @param filePath - Absolute config file path
 * @returns Parsed config object and its local file dependencies
 */
const parseConfigFile = async (
  filePath: string,
): Promise<{ config: unknown; dependencies: string[] }> => {
  const file = path.basename(filePath);

  try {
    if (file.endsWith(".json")) {
      return {
        config: JSON.parse(fs.readFileSync(filePath, "utf-8")),
        dependencies: [filePath],
      };
    }

    if (file.endsWith(".yml") || file.endsWith(".yaml")) {
      return {
        config: load(fs.readFileSync(filePath, "utf-8")),
        dependencies: [filePath],
      };
    }

    const { module, dependencies } = await unrun({ path: filePath });

    return {
      config: module,
      dependencies: [...new Set([filePath, ...dependencies])],
    };
  } catch (err) {
    throw new Error(`Error parsing ${file}: ${String(err)}`, { cause: err });
  }
};

/**
 * Load, validate and resolve a specific config file, returning both the resolved config and its
 * dependency list.
 *
 * 加载、校验并解析指定的配置文件，返回解析后的配置及其依赖文件列表。
 *
 * @param root - Resolved project root directory
 * @param filePath - Absolute config file path
 * @returns Resolved config and dependency paths
 */
const evaluateConfig = async (
  root: string,
  filePath: string,
): Promise<{ config: Config; dependencies: string[] }> => {
  const { config, dependencies } = await parseConfigFile(filePath);

  if (config == null || typeof config !== "object") {
    throw new Error(
      `Config file ${path.basename(
        filePath,
      )} must export a configuration object, but got: ${typeof config}`,
    );
  }

  const validated = validateConfig(config, root, filePath);

  if (validated.locales["/"] == null) {
    throw new Error(
      `Invalid configuration in ${path.basename(
        filePath,
      )}: a root locale with the key "/" is required (locale keys are path prefixes such as "/" and "/zh/").`,
    );
  }

  try {
    return {
      config: await resolveConfig(validated),
      dependencies,
    };
  } catch (err) {
    throw new Error(
      `Failed to resolve configuration from ${path.basename(filePath)}: ${String(err)}`,
      { cause: err },
    );
  }
};

/**
 * Load, validate and resolve the user config.
 *
 * Results are cached per root directory on `globalThis` and reused across evaluations in the same
 * process (such as Vite's client build + nested SSR build) as long as the config file and its
 * dependencies have not changed on disk.
 *
 * 加载、校验并解析用户配置。结果按项目根目录缓存在 `globalThis` 上，只要配置文件及其依赖未发生变化即可在同一进程内复用。
 *
 * @param root - Project root directory
 * @returns Resolved config
 */
export const loadConfig = async (root: string): Promise<Config> => {
  const rootKey = path.resolve(root);
  const cache = getConfigCache();
  const filePath = findConfigFile(rootKey);

  if (!filePath) {
    cache.delete(rootKey);
    throw new Error(
      `No configuration file found. Please create one of the following files: ${CONFIG_FILES.join(
        ", ",
      )}`,
    );
  }

  const cached = cache.get(rootKey);

  if (cached && cached.configPath === filePath) {
    const currentSignature = computeFilesSignature(cached.dependencies);

    if (currentSignature === cached.signature) {
      if (cached.config) return cached.config;
      if (cached.promise) return cached.promise;
    }
  }

  const initialDependencies = [filePath];
  const initialSignature = computeFilesSignature(initialDependencies);

  const entry: ConfigCacheEntry = {
    configPath: filePath,
    dependencies: initialDependencies,
    signature: initialSignature,
  };

  const promise = (async (): Promise<Config> => {
    try {
      const { config, dependencies } = await evaluateConfig(rootKey, filePath);

      if (cache.get(rootKey) === entry) {
        entry.dependencies = dependencies;
        entry.signature = computeFilesSignature(dependencies);
        entry.config = config;
        delete entry.promise;
      }

      return config;
    } catch (err) {
      if (cache.get(rootKey) === entry) cache.delete(rootKey);

      throw err;
    }
  })();

  entry.promise = promise;
  cache.set(rootKey, entry);

  return promise;
};
