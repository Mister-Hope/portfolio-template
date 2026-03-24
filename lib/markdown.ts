import MarkdownIt from "markdown-it";

import type { MdItConfig } from "../src/types/index.js";

export type { MdItConfig };

// Strip scope prefix, known plugin prefixes, then kebab→camelCase.
// e.g. @scope/plugin-foo → foo, markdown-it-foo-bar → fooBar
const deriveExportName = (pluginName: string): string => {
  const base = pluginName.includes("/")
    ? pluginName.slice(pluginName.lastIndexOf("/") + 1)
    : pluginName;

  const unprefixed = base.replace(/^(?:markdown-it-|plugin-)/, "");

  return unprefixed.replaceAll(/-([a-z])/g, (_, chr: string) => chr.toUpperCase());
};

// Resolution order:
//   1. mod itself is a function → use it.
//   2. mod.default exists → use it.
//   3. Derive a name from pluginName and try mod[derivedName].
//   4. Fall back to mod as-is.
const resolvePlugin = (mod: unknown, pluginName: string): unknown => {
  if (typeof mod === "function") return mod;

  const rec = mod as Record<string, unknown>;

  if ("default" in rec) return rec.default;

  const derived = deriveExportName(pluginName);

  if (derived in rec) return rec[derived];

  return mod;
};

export const createMarkdownRenderer = async (
  mdIt?: MdItConfig,
): Promise<(content: string, inline?: boolean) => string> => {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

  if (mdIt) {
    if (typeof mdIt === "function") {
      mdIt(md);
    } else {
      const loadedPlugins = await Promise.all(
        mdIt.map(async (entry) => {
          // oxlint-disable-next-line typescript/no-unsafe-assignment
          const [pluginName, options] = typeof entry === "string" ? [entry, null] : entry;

          try {
            // oxlint-disable-next-line typescript/no-unsafe-assignment
            const mod = await import(pluginName);

            return {
              plugin: resolvePlugin(mod, pluginName),
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
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-argument
        if (options == null) md.use(plugin as any);
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-argument
        else md.use(plugin as any, options);
      }
    }
  }

  return (content: string, inline = false): string => {
    if (!content) return "";

    if (inline) return md.renderInline(content);

    return md.render(content);
  };
};
