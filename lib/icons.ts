import fs from "node:fs";
import { createRequire } from "node:module";

import type { IconifyJSON } from "@iconify/react";
import type { IconifyIcon } from "@iconify/utils";
import { getIconData } from "@iconify/utils";

import type { Config } from "../src/types/index.js";
import { defaultExperienceTypes } from "../src/utils/experience.js";

const require = createRequire(import.meta.url);
const iconSetCache = new Map<string, IconifyJSON>();

/**
 * Icons hardcoded across `src/components/*.tsx`.
 *
 * 组件源码中硬编码使用的图标名。
 */
const BUILTIN_COMPONENT_ICONS = [
  "arrow-up-right-from-square",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "circle-check",
  "envelope",
  "language",
  "location-dot",
  "moon",
  "paper-plane",
  "quote-left",
  "sun",
  "xmark",
] as const;

/**
 * Determine whether an icon string is an external/public image URL rather than an Iconify icon.
 *
 * 判断图标字符串是否为图片 URL（而非 Iconify 图标名）。
 *
 * @param icon - Raw icon value
 * @returns `true` when the value is rendered as an `<img>`
 */
const isImageUrl = (icon: string): boolean => icon.startsWith("/") || icon.startsWith("http");

/**
 * Normalize a short icon name into `prefix:name` form, matching `src/components/Icon.tsx`.
 *
 * 将简写图标名规范化为 `prefix:name` 格式（与 `src/components/Icon.tsx` 保持一致）。
 *
 * @param icon - Raw icon name
 * @returns Normalized `prefix:name` identifier
 */
export const resolveIconName = (icon: string): string => {
  if (icon.includes(":")) return icon;

  return `fa7-solid:${icon.replace(/^fa-/u, "")}`;
};

/**
 * Recursively walk a value and add every string property named `icon` to `out`.
 *
 * 递归遍历配置对象，收集所有名为 `icon` 的字符串字段。
 *
 * @param value - Value to walk
 * @param out - Target set of raw icon strings
 */
const collectIconsFromValue = (value: unknown, out: Set<string>): void => {
  if (value == null || typeof value !== "object") return;

  if (Array.isArray(value)) {
    for (const item of value) collectIconsFromValue(item, out);

    return;
  }

  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (key === "icon" && typeof entry === "string" && entry.length > 0) out.add(entry);
    else if (entry != null && typeof entry === "object") collectIconsFromValue(entry, out);
  }
};

/**
 * Load and cache an Iconify JSON set from `@iconify-json/<prefix>/icons.json`.
 *
 * 从 `@iconify-json/<prefix>/icons.json` 加载并缓存图标集。
 *
 * @param prefix - Iconify prefix (e.g. `"fa7-solid"`)
 * @param iconName - Full icon name requesting the set (for error reporting)
 * @returns Parsed `IconifyJSON` icon set
 */
const loadIconSet = (prefix: string, iconName: string): IconifyJSON => {
  const cached = iconSetCache.get(prefix);

  if (cached) return cached;

  const packageName = `@iconify-json/${prefix}`;
  let jsonPath: string;

  try {
    jsonPath = require.resolve(`${packageName}/icons.json`);
  } catch (err) {
    throw new Error(
      `Icon "${iconName}" uses the "${prefix}" icon set, which is not installed. Please install "${packageName}" (e.g. \`pnpm add -D ${packageName}\`).`,
      { cause: err },
    );
  }

  const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as IconifyJSON;

  iconSetCache.set(prefix, parsed);

  return parsed;
};

/**
 * Collect all Iconify icons referenced by the resolved config, built-in experience types, and
 * source components, returning a lookup table keyed by resolved `prefix:name`.
 *
 * 收集配置、内置经历类型与组件源码中使用的所有 Iconify 图标数据。
 *
 * @param config - Resolved user configuration
 * @returns Map from resolved `prefix:name` to `IconifyIcon` data
 */
export const collectIconData = (config: Config): Record<string, IconifyIcon> => {
  const rawIcons = new Set<string>(BUILTIN_COMPONENT_ICONS);

  for (const item of Object.values(defaultExperienceTypes)) rawIcons.add(item.icon);

  collectIconsFromValue(config, rawIcons);

  const byPrefix = new Map<string, Set<string>>();

  for (const raw of rawIcons) {
    if (!raw || isImageUrl(raw)) continue;

    const resolved = resolveIconName(raw);
    const separatorIndex = resolved.indexOf(":");
    const prefix = separatorIndex > 0 ? resolved.slice(0, separatorIndex) : "";
    const name = separatorIndex > 0 ? resolved.slice(separatorIndex + 1) : "";

    if (!prefix || !name) {
      throw new Error(
        `Invalid icon name "${raw}". Expected an Iconify name such as "fa7-solid:user" or a FontAwesome 7 solid shorthand such as "user".`,
      );
    }

    let names = byPrefix.get(prefix);

    if (!names) {
      names = new Set<string>();
      byPrefix.set(prefix, names);
    }

    names.add(name);
  }

  const result: Record<string, IconifyIcon> = {};

  for (const [prefix, names] of byPrefix) {
    const [firstIcon = ""] = names;
    const iconSet = loadIconSet(prefix, `${prefix}:${firstIcon}`);

    for (const name of names) {
      const fullName = `${prefix}:${name}`;
      const data = getIconData(iconSet, name);

      if (!data) {
        throw new Error(
          `Icon "${fullName}" was not found in "@iconify-json/${prefix}". Please check the icon name or install the appropriate "@iconify-json/<prefix>" package.`,
        );
      }

      result[fullName] = data;
    }
  }

  return result;
};
