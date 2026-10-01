import type { FC } from "react";

import { RichContent } from "./RichContent.js";

/**
 * Current year, resolved once per render session so the render path stays pure.
 *
 * 当前年份，每次渲染会话仅解析一次，保证渲染过程纯净。
 */
const CURRENT_YEAR = new Date().getFullYear();

export interface FooterProps {
  /**
   * Copyright text
   *
   * 版权文本
   */
  copyright?: string;
  /**
   * Optional footer description
   *
   * 可选页脚描述
   */
  description?: string;
}

/**
 * Footer component
 *
 * Displays the footer with copyright and optional description.
 *
 * 页脚组件
 *
 * 显示带有版权和可选描述的页脚。
 */
export const Footer: FC<FooterProps> = ({ copyright, description }) =>
  copyright || description ? (
    <footer className="footer-container">
      <div className="footer-content">
        {copyright && (
          <RichContent
            content={copyright.replaceAll("$year", String(CURRENT_YEAR))}
            className="footer-copyright"
            block
          />
        )}
        {description && <RichContent content={description} className="footer-description" block />}
      </div>
    </footer>
  ) : null;
