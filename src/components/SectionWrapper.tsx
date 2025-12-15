import type { FC, ReactNode } from "react";

import { Icon } from "./Icon.js";

/**
 * Props for the SectionWrapper component
 * SectionWrapper 组件的属性
 */
interface Props {
  /**
   * Section title
   * 章节标题
   */
  title: string;
  /**
   * Optional FontAwesome icon class suffix (e.g., "user" for "fa-solid fa-user")
   * 可选的 FontAwesome 图标类后缀 (例如 "user" 对应 "fa-solid fa-user")
   */
  icon?: string;
  /**
   * Child components to render within the section
   * 在章节内渲染的子组件
   */
  children: ReactNode;
  /**
   * HTML ID attribute for navigation anchors
   * 用于导航锚点的 HTML ID 属性
   */
  id?: string;
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
export const SectionWrapper: FC<Props> = ({ title, icon, children, id }) => {
  return (
    <section
      id={id}
      className="py-16 md:py-24 first:pt-8 scroll-mt-24 md:scroll-mt-32 border-t border-slate-100 dark:border-white/5 first:border-t-0"
    >
      <div className="flex flex-col gap-10 md:gap-14">
        {/* Section Header */}
        <div className="flex items-center gap-4 md:gap-6">
          {icon && (
            <Icon
              icon={`fa-solid ${icon}`}
              className="text-3xl md:text-4xl lg:text-5xl text-blue-600 dark:text-blue-400 flex-shrink-0"
            />
          )}
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-none">
              {title}
            </h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">{children}</div>
      </div>
    </section>
  );
};
