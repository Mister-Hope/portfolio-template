import { renderMarkdown } from "./markdown.js";
import type { Config, LocaleConfig, Section } from "../src/types/index.js";

const processSection = (section: Section): Section => {
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
              text: renderMarkdown(item.text, true),
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
      break;
    }

    default: {
      throw new Error(`Unknown section type: ${(result as Section).type}`);
    }
  }

  return result;
};

export const resolveLocaleConfig = (config: LocaleConfig): LocaleConfig => ({
  ...config,
  sections: config.sections.map(processSection),
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

export const resolveConfig = (config: Config): Config => ({
  ...config,
  locales: Object.fromEntries(
    Object.entries(config.locales).map(([path, localeConfig]) => [
      path,
      resolveLocaleConfig(localeConfig),
    ]),
  ),
});
