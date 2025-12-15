import type { FC } from "react";

import { Icon } from "./Icon.js";
import MarkdownText from "./MarkdownText.js";

/**
 * Action button configuration for the banner
 * Banner 的操作按钮配置
 */
export interface BannerAction {
  /**
   * Button label text
   * 按钮标签文本
   */
  label: string;
  /**
   * URL the button links to
   * 按钮链接地址
   */
  link: string;
  /**
   * Whether this is a primary action (emphasized style)
   * 是否为主要操作 (强调样式)
   * @default false
   */
  primary?: boolean;
}

/**
 * Props for the Banner component
 * Banner 组件的属性
 */
export interface BannerProps {
  /**
   * Section title or tag displayed at the top
   * 顶部显示的章节标题或标签
   */
  title: string;
  /**
   * Main headline text
   * 主要标题文本
   */
  subtitle: string;
  /**
   * Main content text (Markdown supported)
   * 主要内容文本 (支持 Markdown)
   */
  content: string;
  /**
   * Optional deadline string to display with a clock icon
   * 可选的截止日期字符串，显示时带有钟表图标
   */
  deadline?: string;
  /**
   * List of action buttons
   * 操作按钮列表
   */
  actions: BannerAction[];
}

/**
 * Banner component
 *
 * A prominent section for important announcements or calls to action.
 * Features a gradient background, decorative shapes, and support for multiple action buttons.
 *
 * Banner 组件
 *
 * 用于重要公告或号召性用语的突出部分。
 * 具有渐变背景、装饰形状，并支持多个操作按钮。
 */
export const Banner: FC<BannerProps> = ({
  title,
  subtitle,
  content,
  deadline,
  actions,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-800 dark:from-indigo-800 dark:to-blue-950 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-200 dark:shadow-none">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          {title && (
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider">
              {title}
            </div>
          )}
          <div className="space-y-2">
            {subtitle && (
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                {subtitle}
              </h3>
            )}
            {/* 
              Targeting links inside MarkdownText specifically for the banner.
              We use white color and bold underline to contrast with the indigo/blue background.
            */}
            <div
              className="text-blue-100 dark:text-blue-200 text-lg max-w-2xl leading-relaxed 
              [&_a]:text-white [&_a]:font-black [&_a]:underline [&_a]:underline-offset-4 
              [&_a]:decoration-blue-300/50 hover:[&_a]:decoration-white hover:[&_a]:text-blue-100 transition-all"
            >
              <MarkdownText content={content} />
            </div>
          </div>
          {deadline && (
            <div className="flex items-center gap-3 text-sm font-semibold text-blue-200 dark:text-blue-300">
              <Icon icon="fa-solid fa-clock" />
              Deadline: {deadline}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {actions.map((action, idx) => (
            <a
              key={idx}
              href={action.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-8 py-4 rounded-2xl font-bold text-center transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${
                action.primary
                  ? "bg-white text-blue-700 shadow-xl shadow-blue-900/20 dark:shadow-none"
                  : "bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10"
              }`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
