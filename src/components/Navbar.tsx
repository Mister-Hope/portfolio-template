import { useState, useEffect } from "react";
import type { NavLink } from "../types/index.js";
import type { FC } from "react";
import { Icon } from "./Icon.js";

/**
 * Props for the Navbar component
 * 导航栏组件的属性
 */
interface NavbarProps {
  /**
   * List of navigation links
   * 导航链接列表
   */
  links: NavLink[];
  /**
   * Name of the next locale to switch to
   * 切换到的下一个语言名称
   */
  nextLocaleName: string;
  /**
   * Callback to change locale
   * 切换语言的回调函数
   */
  onLocaleChange: () => void;
  /**
   * Current theme ("light" or "dark")
   * 当前主题 ("light" 或 "dark")
   */
  theme: "light" | "dark";
  /**
   * Callback to toggle theme
   * 切换主题的回调函数
   */
  onThemeChange: (event: React.MouseEvent) => void;
  /**
   * Tooltip text for theme toggler
   * 主题切换器的提示文本
   */
  themeLabel?: string;
  /**
   * Brand name displayed in the navbar
   * 导航栏中显示的品牌名称
   */
  brand: string;
  /**
   * Whether to show the locale switcher
   * 是否显示语言切换器
   */
  showLocaleSwitch?: boolean;
}

/**
 * Navbar component
 *
 * Fixed navigation bar with scroll effect, language switcher, and theme toggler.
 *
 * 导航栏组件
 *
 * 带有滚动效果、语言切换器和主题切换器的固定导航栏。
 */
export const Navbar: FC<NavbarProps> = ({
  links,
  nextLocaleName,
  onLocaleChange,
  theme,
  onThemeChange,
  themeLabel = "Toggle Theme",
  brand,
  showLocaleSwitch = true,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return (): void => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar-base ${scrolled ? "navbar-scrolled" : "navbar-transparent"}`}>
      <div className="navbar-container">
        <a
          href="#"
          className={`navbar-brand ${
            scrolled ? "navbar-brand-scrolled" : "navbar-brand-transparent"
          }`}
        >
          {brand}
        </a>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="navbar-links">
            {links.map(({ label, anchor }) => (
              <a
                key={label}
                href={anchor}
                className={`navbar-link ${
                  scrolled ? "navbar-link-scrolled" : "navbar-link-transparent"
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            {showLocaleSwitch && (
              <button
                type="button"
                onClick={onLocaleChange}
                className={`nav-btn-base navbar-locale-btn ${
                  scrolled ? "nav-btn-scrolled" : "nav-btn-transparent"
                }`}
              >
                <Icon icon="language" className="text-main" />
                {nextLocaleName}
              </button>
            )}

            <button
              type="button"
              onClick={onThemeChange}
              className={`nav-btn-base navbar-theme-btn ${
                scrolled ? "nav-btn-scrolled" : "nav-btn-transparent"
              }`}
              title={themeLabel}
            >
              <Icon icon={theme === "light" ? "moon" : "sun"} className="text-main" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
