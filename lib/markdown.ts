import MarkdownIt from "markdown-it";

import type { MdItConfig } from "../src/types/index.js";

export type { MdItConfig };

export const createMarkdownRenderer = async (
  mdIt?: MdItConfig,
): Promise<(content: string, inline?: boolean) => string> => {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

  if (mdIt) {
    if (typeof mdIt === "function") {
      mdIt(md);
    } else {
      const loadedPlugins = await Promise.all(
        mdIt.map(async ([pluginName, ...args]) => {
          try {
            // oxlint-disable-next-line typescript/no-unsafe-assignment
            const mod = await import(pluginName);
            // oxlint-disable-next-line typescript/no-unsafe-return, typescript/no-unsafe-member-access
            return [mod.default ?? mod, args];
          } catch (err) {
            throw new Error(`Failed to load markdown-it plugin "${pluginName}": ${String(err)}`, {
              cause: err,
            });
          }
        }),
      );

      for (const [plugin, args] of loadedPlugins) {
        // oxlint-disable-next-line typescript/no-unsafe-argument
        md.use(plugin, ...(args as unknown[]));
      }
    }
  }

  return (content: string, inline = false): string => {
    if (!content) return "";

    if (inline) return md.renderInline(content);

    return md.render(content);
  };
};
