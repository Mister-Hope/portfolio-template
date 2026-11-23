import type { Config, LocaleConfig, Section } from "../src/types/index.js";
import type { ImageDimensions } from "./imageDimensions.js";
import { createImageDimensionsResolver } from "./imageDimensions.js";
import { createMarkdownRenderer } from "./markdown.js";

type RenderMarkdown = (content: string, inline?: boolean) => string;
type ResolveImageDimensions = (url: string) => ImageDimensions | null;

const processSection = (
  section: Section,
  renderMarkdown: RenderMarkdown,
  resolveImageDimensions: ResolveImageDimensions,
): Section => {
  const result = { ...section };

  switch (result.type) {
    case "banner": {
      const processedData = { ...result.data };

      if (processedData.header) processedData.header = renderMarkdown(processedData.header, true);

      if (processedData.content) processedData.content = renderMarkdown(processedData.content);

      if (processedData.footer) processedData.footer = renderMarkdown(processedData.footer, true);

      result.data = processedData;

      break;
    }

    case "cards": {
      result.data = result.data.map((item) => ({
        ...item,
        title: renderMarkdown(item.title, true),
        ...(item.description ? { description: renderMarkdown(item.description) } : {}),
      }));
      break;
    }

    case "experience": {
      result.data = result.data.map((item) => ({
        ...item,
        ...(item.title ? { title: renderMarkdown(item.title, true) } : {}),
        ...(item.description ? { description: renderMarkdown(item.description) } : {}),
        ...(item.content ? { content: renderMarkdown(item.content) } : {}),
      }));
      break;
    }

    case "list": {
      result.data = result.data.map((item) =>
        typeof item === "object"
          ? {
              ...item,
              text: renderMarkdown(item.text, Boolean(item.link)),
            }
          : renderMarkdown(item),
      );
      break;
    }

    case "profile": {
      const processedData = { ...result.data };

      if (processedData.slogan) processedData.slogan = renderMarkdown(processedData.slogan);

      if (Array.isArray(processedData.fields)) {
        processedData.fields = processedData.fields.map((field) => ({
          ...field,
          value:
            typeof field.value === "string"
              ? renderMarkdown(field.value)
              : field.value.map((item) => renderMarkdown(item, true)),
        }));
      }
      result.data = processedData;
      break;
    }

    case "timeline": {
      result.data = result.data.map((item) => ({
        ...item,
        content: renderMarkdown(item.content),
      }));
      break;
    }

    case "markdown": {
      result.data.content = renderMarkdown(result.data.content);
      break;
    }

    case "gallery": {
      result.data = result.data.map((item) => {
        const processed = item.description
          ? { ...item, description: renderMarkdown(item.description) }
          : item;

        if (processed.width != null && processed.height != null) return processed;

        const dimensions = resolveImageDimensions(processed.url);

        return dimensions
          ? {
              ...processed,
              width: processed.width ?? dimensions.width,
              height: processed.height ?? dimensions.height,
            }
          : processed;
      });
      break;
    }

    default: {
      throw new Error(`Unknown section type: ${(result as Section).type}`);
    }
  }

  return result;
};

const resolveLocaleConfig = (
  config: LocaleConfig,
  renderMarkdown: RenderMarkdown,
  resolveImageDimensions: ResolveImageDimensions,
): LocaleConfig => ({
  ...config,
  sections: config.sections.map((section) =>
    processSection(section, renderMarkdown, resolveImageDimensions),
  ),
  ...(config.footer
    ? {
        footer: {
          ...config.footer,
          ...(config.footer.copyright
            ? { copyright: renderMarkdown(config.footer.copyright) }
            : {}),
          ...(config.footer.description
            ? { description: renderMarkdown(config.footer.description) }
            : {}),
        },
      }
    : {}),
});

export const resolveConfig = async (config: Config, root: string): Promise<Config> => {
  const renderMarkdown = await createMarkdownRenderer(config.config?.mdIt);
  const resolveImageDimensions = createImageDimensionsResolver(root);

  const resolved: Config = {
    ...config,
    locales: Object.fromEntries(
      Object.entries(config.locales).map(([localePath, localeConfig]) => [
        localePath,
        resolveLocaleConfig(localeConfig, renderMarkdown, resolveImageDimensions),
      ]),
    ),
  };

  // Strip mdIt from the serialized config — it is only needed during resolution
  // and cannot be serialized (function form) or is not useful at runtime.
  if (resolved.config?.mdIt) {
    const { mdIt: _mdIt, ...restConfig } = resolved.config;

    resolved.config = restConfig;
  }

  return resolved;
};
