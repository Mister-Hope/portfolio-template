import type { FC } from "react";

// Use markdown-it from global scope
declare const markdownit: any;
const md =
  typeof markdownit !== "undefined"
    ? markdownit({ html: true, linkify: true, typographer: true })
    : null;

/**
 * Props for the MarkdownText component
 * MarkdownText 组件的属性
 */
interface MarkdownTextProps {
  /**
   * Markdown content string
   * Markdown 内容字符串
   */
  content: string;
  /**
   * Optional CSS class name
   * 可选 CSS 类名
   */
  className?: string;
}

/**
 * MarkdownText component
 *
 * Renders inline Markdown content using markdown-it.
 * Falls back to plain text if markdown-it is not available.
 *
 * MarkdownText 组件
 *
 * 使用 markdown-it 渲染内联 Markdown 内容。
 * 如果 markdown-it 不可用，则回退到纯文本。
 */
const MarkdownText: FC<MarkdownTextProps> = ({ content, className = "" }) => {
  if (!md) return <span className={className}>{content}</span>;
  const html = md.renderInline(content);

  return (
    <span
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownText;
