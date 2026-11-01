import { useEffect, useState } from "react";
import type { FC } from "react";

import { RichContent } from "./RichContent.js";

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
export const Footer: FC<FooterProps> = ({ copyright, description }) => {
  // Start with the build year (the server rendered it and the first client render must match),
  // then update to the visitor's current year after mounting. This keeps `$year` correct for
  // pages built in a previous year without breaking hydration.
  const [year, setYear] = useState(__BUILD_YEAR__);

  useEffect(() => {
    const currentYear = new Date().getFullYear();

    // oxlint-disable-next-line react/set-state-in-effect -- one-shot sync with the visitor's clock after hydration
    if (currentYear !== year) setYear(currentYear);
  }, [year]);

  if (!copyright && !description) return null;

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {copyright && (
          <RichContent
            content={copyright.replaceAll("$year", String(year))}
            className="footer-copyright"
            block
          />
        )}
        {description && <RichContent content={description} className="footer-description" block />}
      </div>
    </footer>
  );
};
