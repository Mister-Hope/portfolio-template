import type { PluginSimple, PluginWithOptions } from "@mdit/helper";
import MarkdownIt from "markdown-it";

import type { MdItConfig } from "../src/types/index.js";

/**
 * Pattern matching valid npm package specifiers (scoped or unscoped, with optional subpaths).
 *
 * 匹配合法的 npm 包说明符（带或不带作用域，可选子路径）。
 */
const PACKAGE_SPECIFIER_PATTERN =
  /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*(?:\/(?!\.\.?(?:\/|$))[a-zA-Z0-9-._~]+)*$/u;

/**
 * Pattern matching local paths, Windows drive paths, URLs, or backslashes.
 *
 * 匹配本地路径、Windows 盘符路径、URL 或反斜杠。
 */
const PATH_OR_URL_PATTERN = /^(?:\/|\.\.?\/|~|[a-zA-Z]:[\\/]|[a-zA-Z][a-zA-Z0-9+.-]*:)|\\/u;

/**
 * Validate that a markdown-it plugin specifier is an npm package name and not a path or URL.
 *
 * 校验 markdown-it 插件说明符是否为合法的 npm 包名（拒绝路径或 URL）。
 *
 * @param pluginName - Configured plugin specifier
 */
const validatePluginSpecifier = (pluginName: string): void => {
  if (
    typeof pluginName !== "string" ||
    !pluginName ||
    PATH_OR_URL_PATTERN.test(pluginName) ||
    !PACKAGE_SPECIFIER_PATTERN.test(pluginName)
  ) {
    throw new Error(
      `Invalid markdown-it plugin specifier "${pluginName}": only npm package names are allowed (paths and URLs are not permitted).`,
    );
  }
};

/**
 * Strip scope prefix and known plugin prefixes, then convert kebab-case to camelCase. e.g.
 * `@scope/plugin-foo` → `foo`, `markdown-it-foo-bar` → `fooBar`
 *
 * 去除作用域前缀和已知插件前缀，并将短横线命名转为驼峰命名。
 *
 * @param pluginName - Plugin package name
 * @returns Derived export name
 */
const deriveExportName = (pluginName: string): string => {
  const base = pluginName.includes("/")
    ? pluginName.slice(pluginName.lastIndexOf("/") + 1)
    : pluginName;

  const unprefixed = base.replace(/^(?:markdown-it-|plugin-)/u, "");

  return unprefixed.replaceAll(/-(?<char>[a-z])/gu, (_, char: string) => char.toUpperCase());
};

/**
 * Resolve the plugin function from an imported module.
 *
 * Resolution order:
 *
 * 1. `mod` itself is a function → use it.
 * 2. `mod.default` exists → use it.
 * 3. Derive a name from `pluginName` and try `mod[derivedName]`.
 * 4. Fall back to `mod` as-is.
 *
 * 按优先级从导入的模块中解析插件导出。
 *
 * @param mod - Imported module namespace
 * @param pluginName - Plugin package name
 * @returns Resolved plugin candidate
 */
const resolvePlugin = (mod: unknown, pluginName: string): unknown => {
  if (typeof mod === "function") return mod;
  if (mod == null || typeof mod !== "object") return mod;

  const rec = mod as Record<string, unknown>;

  if ("default" in rec) return rec.default;

  const derived = deriveExportName(pluginName);

  if (derived in rec) return rec[derived];

  return mod;
};

/**
 * Built-in plugin: add `target="_blank" rel="noopener noreferrer"` to external links (absolute URLs
 * starting with `http://`, `https://`, or `//`); leave internal links unchanged.
 *
 * 内置插件：为外部链接添加 `target="_blank" rel="noopener noreferrer"`，保留站内链接不变。
 *
 * @param md - MarkdownIt instance
 */
const externalLinkPlugin: PluginSimple = (md) => {
  const defaultRender = md.renderer.rules.link_open ?? md.renderer.renderToken.bind(md.renderer);

  // oxlint-disable-next-line max-params
  md.renderer.rules.link_open = (tokens, idx, options, env, self): string => {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex("href");

    if (hrefIndex >= 0 && token.attrs) {
      const [, href] = token.attrs[hrefIndex];

      if (typeof href === "string" && /^(?:https?:)?\/\//iu.test(href)) {
        token.attrSet("target", "_blank");
        token.attrSet("rel", "noopener noreferrer");
      }
    }

    return defaultRender(tokens, idx, options, env, self);
  };
};

/**
 * Create a Markdown renderer configured with the built-in external-link plugin and user `mdIt`
 * plugins.
 *
 * 创建带有内置外链插件和用户 `mdIt` 插件配置的 Markdown 渲染函数。
 *
 * @param mdIt - Optional markdown-it plugin configuration
 * @returns Markdown rendering function
 */
export const createMarkdownRenderer = async (
  mdIt?: MdItConfig,
): Promise<(content: string, inline?: boolean) => string> => {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

  // Always apply the built-in external-link plugin first
  md.use(externalLinkPlugin);

  if (mdIt) {
    if (typeof mdIt === "function") {
      mdIt(md);
    } else {
      const loadedPlugins = await Promise.all(
        mdIt.map(async (entry) => {
          // oxlint-disable-next-line typescript/no-unsafe-assignment
          const [pluginName, options] = typeof entry === "string" ? [entry, null] : entry;

          validatePluginSpecifier(pluginName);

          try {
            // oxlint-disable-next-line typescript/no-unsafe-assignment
            const mod = await import(pluginName);
            const plugin = resolvePlugin(mod, pluginName);

            if (typeof plugin !== "function") {
              throw new TypeError(
                `Markdown-it plugin "${pluginName}" did not resolve to a function (got ${typeof plugin}).`,
              );
            }

            return {
              plugin,
              // oxlint-disable-next-line typescript/no-unsafe-assignment
              options,
            };
          } catch (err) {
            throw new Error(`Failed to load markdown-it plugin "${pluginName}": ${String(err)}`, {
              cause: err,
            });
          }
        }),
      );

      for (const { plugin, options } of loadedPlugins) {
        if (options == null) md.use(plugin as PluginSimple);
        else md.use(plugin as PluginWithOptions, options);
      }
    }
  }

  return (content: string, inline = false): string => {
    if (!content) return "";

    if (inline) return md.renderInline(content);

    return md.render(content);
  };
};
