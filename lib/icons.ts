import fs from "node:fs";
import { createRequire } from "node:module";

import type { IconifyIcon, IconifyJSON } from "@iconify/react";

import type { Config } from "../src/types/index.js";
import { defaultExperienceTypes } from "../src/utils/experience.js";

const require = createRequire(import.meta.url);
const iconSetCache = new Map<string, IconifyJSON | null>();

/**
 * Icons hardcoded across `src/components/*.tsx` and `src/utils/experience.ts`.
 *
 * 组件与内置经历类型中硬编码使用的图标名。
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
 * Resolve an icon (including aliases) from an Iconify JSON set.
 *
 * 从 Iconify JSON 图标集中解析图标（包括别名）。
 *
 * @param iconSet - Parsed Iconify icon set
 * @param name - Icon name without the prefix
 * @param depth - Current alias recursion depth
 * @returns Icon data, or `null` when the icon does not exist
 */
export const resolveIconFromSet = (
  iconSet: IconifyJSON,
  name: string,
  depth = 0,
): IconifyIcon | null => {
  const defaultWidth = iconSet.width ?? 16;
  const defaultHeight = iconSet.height ?? defaultWidth;

  const normalize = (data: Partial<IconifyIcon> & { body: string }): IconifyIcon => ({
    ...data,
    width: data.width ?? defaultWidth,
    height: data.height ?? defaultHeight,
  });

  if (Object.hasOwn(iconSet.icons, name)) return normalize(iconSet.icons[name]);

  if (depth > 8) return null;

  const alias = iconSet.aliases?.[name];

  if (!alias) return null;

  const { parent, ...overrides } = alias;
  const parentIcon = resolveIconFromSet(iconSet, parent, depth + 1);

  if (!parentIcon) return null;

  return normalize({ ...parentIcon, ...overrides, body: parentIcon.body });
};

/**
 * Load an installed `@iconify-json/<prefix>` set.
 *
 * 加载已安装的 `@iconify-json/<prefix>` 图标集。
 *
 * @param prefix - Iconify prefix
 * @returns Parsed icon set, or `null` when the package is not installed or unreadable
 */
const loadIconSet = (prefix: string): IconifyJSON | null => {
  if (iconSetCache.has(prefix)) return iconSetCache.get(prefix) ?? null;

  let iconSet: IconifyJSON | null = null;

  try {
    const jsonPath = require.resolve(`@iconify-json/${prefix}/icons.json`);

    iconSet = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as IconifyJSON;
  } catch {
    // The set is optional: unresolved icons fall back to the runtime Iconify API.
  }

  iconSetCache.set(prefix, iconSet);

  return iconSet;
};

/**
 * Collect icon data for every icon whose `@iconify-json/<prefix>` package is installed.
 *
 * 收集所有“对应 `@iconify-json/<prefix>` 已安装”的图标数据。
 *
 * No icon set is required. Icons from missing sets are left out of the map and continue to be
 * resolved by `@iconify/react` at runtime, so users keep the full Iconify catalogue without
 * installing anything extra.
 *
 * 不强制安装任何图标集。缺少图标集的图标不会写入映射，继续由 `@iconify/react` 在运行时加载， 因此用户无需额外安装即可使用完整的 Iconify 图标库。
 *
 * @param config - Resolved user configuration
 * @returns Map from resolved `prefix:name` to icon data
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
    const iconSet = loadIconSet(prefix);

    if (!iconSet) continue;

    for (const name of names) {
      const data = resolveIconFromSet(iconSet, name);

      if (data) result[`${prefix}:${name}`] = data;
    }
  }

  return result;
};
