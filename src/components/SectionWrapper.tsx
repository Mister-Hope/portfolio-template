import type { FC, ReactNode } from "react";

import { isCJKLocale } from "../utils/index.js";
import { Icon } from "./Icon.js";

export interface SectionBase {
  /**
   * Section title
   * 章节标题
   */
  title?: string;
  /**
   * Section icon class
   * 章节图标类名
   */
  icon?: string;
  /**
   * Unique identifier for the block (used for navigation)
   * 块的唯一标识符 (用于导航)
   */
  id?: string;
}

/**
 * Props for the SectionWrapper component
 * SectionWrapper 组件的属性
 */
export interface SectionProps extends SectionBase {
  /**
   * Child components to render within the section
   * 在章节内渲染的子组件
   */
  children: ReactNode;
  /**
   * Current locale
   * 当前语言
   */
  locale?: string;
}

/**
 * SectionWrapper component
 *
 * A wrapper component that provides consistent styling, spacing, and headers for content sections.
 *
 * 章节包装器组件
 *
 * 为内容章节提供一致的样式、间距和标题的包装器组件。
 */
export const SectionWrapper: FC<SectionProps> = ({ title, icon, children, id, locale }) => {
  const isCJK = isCJKLocale(locale);

  return (
    <section id={id} className="section-container">
      <div className="section-content-wrapper">
        {/* Section Header */}
        {title && (
          <div className="section-header">
            <div className="section-title-row">
              {icon && <Icon icon={icon} className="section-icon" />}
              <h2 className={`section-heading ${isCJK ? "" : "tracking-tighter"}`}>{title}</h2>
            </div>
            <div className="section-divider" />
          </div>
        )}

        {/* Content Area */}
        <div className="section-children">{children}</div>
      </div>
    </section>
  );
};
