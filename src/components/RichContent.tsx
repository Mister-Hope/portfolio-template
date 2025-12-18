import type { FC } from "react";

/**
 * Props for the RichContent component
 * RichContent 组件的属性
 */
interface RichContentProps {
  /**
   * HTML content string
   * HTML 内容字符串
   */
  content: string;
  /**
   * Whether to display as a block element
   * 是否显示为块级元素
   */
  block?: boolean;
  /**
   * Optional CSS class name
   * 可选 CSS 类名
   */
  className?: string;
}

/**
 * RichContent component to render HTML string
 *
 * 渲染 HTML 字符串的 RichContent 组件
 */
export const RichContent: FC<RichContentProps> = ({
  content,
  block = false,
  className = "",
}) => {
  const Tag = block ? "div" : "span";

  return (
    <Tag
      className={`rich-content ${className}`}
      // eslint-disable-next-line @typescript-eslint/naming-convention
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
