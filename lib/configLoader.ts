import fs from "node:fs";
import path from "node:path";

import Ajv from "ajv";
import type { ValidateFunction } from "ajv";
import { load } from "js-yaml";
import { unrun } from "unrun";

import type { Config } from "../src/types/index.js";
import { resolveConfig } from "./resolveConfig.js";

export const CONFIG_FILES = ["config.ts", "config.js", "config.yml", "config.yaml", "config.json"];

const schemaCache = new Map<string, ValidateFunction>();
let configDependencies: string[] = [];

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
  if (configDependencies.length > 0) return configDependencies;

  const filePath = findConfigFile(root);

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
 * @param root - Project root directory
 * @param filePath - Absolute config file path
 * @returns Parsed config object
 */
const parseConfigFile = async (filePath: string): Promise<unknown> => {
  const file = path.basename(filePath);

  try {
    if (file.endsWith(".json")) return JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (file.endsWith(".yml") || file.endsWith(".yaml"))
      return load(fs.readFileSync(filePath, "utf-8"));

    const { module, dependencies } = await unrun({ path: filePath });

    configDependencies = [...new Set([filePath, ...dependencies])];

    return module;
  } catch (err) {
    throw new Error(`Error parsing ${file}: ${String(err)}`, { cause: err });
  }
};

/**
 * Load, validate and resolve the user config.
 *
 * 加载、校验并解析用户配置。
 *
 * @param root - Project root directory
 * @returns Resolved config
 */
export const loadConfig = async (root: string): Promise<Config> => {
  const filePath = findConfigFile(root);

  if (!filePath) {
    throw new Error(
      `No configuration file found. Please create one of the following files: ${CONFIG_FILES.join(
        ", ",
      )}`,
    );
  }

  const config = await parseConfigFile(filePath);

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
    return await resolveConfig(validated);
  } catch (err) {
    throw new Error(
      `Failed to resolve configuration from ${path.basename(filePath)}: ${String(err)}`,
      { cause: err },
    );
  }
};
