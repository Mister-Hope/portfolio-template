import { useState, useEffect } from "react";
import type { NavLink } from "../types.js";
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
   * Current locale ("en" or "zh")
   * 当前语言 ("en" 或 "zh")
   */
  locale: "en" | "zh";
  /**
   * Callback to change locale
   * 切换语言的回调函数
   */
  onLocaleChange: (l: "en" | "zh") => void;
  /**
   * Current theme ("light" or "dark")
   * 当前主题 ("light" 或 "dark")
   */
  theme: "light" | "dark";
  /**
   * Callback to toggle theme
   * 切换主题的回调函数
   */
  onThemeChange: () => void;
  /**
   * Brand name displayed in the navbar
   * 导航栏中显示的品牌名称
   */
  brand: string;
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
const Navbar: FC<NavbarProps> = ({
  links,
  locale,
  onLocaleChange,
  theme,
  onThemeChange,
  brand,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);

    return (): void => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] border-b transition-all duration-500 ${
        scrolled
          ? "py-4 glass border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/10 dark:shadow-none"
          : "py-8 bg-transparent border-transparent shadow-none"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <a
          href="#"
          className={`text-xl md:text-2xl font-black tracking-tighter transition-all duration-300 ${scrolled ? "text-slate-900 dark:text-white" : "text-white drop-shadow-md"}`}
        >
          {brand}
        </a>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.anchor}
                className={`text-xs md:text-sm font-black uppercase tracking-widest transition-all hover:text-blue-500 ${scrolled ? "text-slate-500 dark:text-slate-400" : "text-white/80"}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-white/10 pl-3 md:pl-10">
            <button
              onClick={() => onLocaleChange(locale === "en" ? "zh" : "en")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-black text-[10px] md:text-xs uppercase tracking-widest ${scrolled ? "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white" : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900"}`}
            >
              <Icon
                icon="fa-solid fa-language"
                className="text-sm md:text-base"
              />
              {locale === "en" ? "CN" : "EN"}
            </button>

            <button
              onClick={onThemeChange}
              className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full border transition-all ${scrolled ? "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white" : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900"}`}
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            >
              <Icon
                icon={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"}`}
                className="text-sm md:text-base"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
