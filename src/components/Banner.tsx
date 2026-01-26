import type { FC } from "react";

import { RichContent } from "./RichContent.js";

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

export interface BannerProps {
  /**
   * Main header text
   * 主要标题文本
   */
  header?: string;

  /**
   * Main content text (Markdown supported)
   * 主要内容文本 (支持 Markdown)
   */
  content?: string;

  /**
   * Optional footer text to display at the bottom (Markdown supported)
   * 底部显示的可选页脚文本 (支持 Markdown)
   */
  footer?: string;

  /**
   * Tags to display at the top
   * 顶部显示的标签
   */
  tags?: string | string[];

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
export const Banner: FC<BannerProps> = ({ header, content, footer, tags, actions }) => (
  <div className="group banner-container">
    {/* Hover gradient overlay */}
    <div className="banner-overlay" />

    {/* Decorative shapes */}
    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-48 w-48 rounded-full bg-primary-400/20 blur-2xl" />

    <div className="relative z-10 flex flex-col items-center gap-8 lg:flex-row">
      <div className="flex-1 space-y-6">
        {tags &&
          (Array.isArray(tags) ? (
            tags.map((tag) => <div className="banner-tag">{tag}</div>)
          ) : (
            <div className="banner-tag">{tags}</div>
          ))}
        <div className="space-y-2">
          {header && (
            <h3 className="banner-title">
              <RichContent content={header} />
            </h3>
          )}
          {/* Since banner has bg, we need to override anchor tags */}
          {content && <RichContent className="banner-content" content={content} block />}
        </div>
        {footer && <RichContent className="banner-footer" content={footer} block />}
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto">
        {actions.map(({ link, primary, label }, index) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`banner-btn ${primary ? "banner-btn-primary" : "banner-btn-secondary"}`}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  </div>
);
