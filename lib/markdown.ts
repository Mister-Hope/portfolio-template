import MarkdownIt from "markdown-it";

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

export const renderMarkdown = (content: string, inline = false): string => {
  if (!content) return "";

  if (inline) return md.renderInline(content);

  return md.render(content);
};
