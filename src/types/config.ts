import type { HeroConfig } from "./hero.js";
import type { NavbarConfig } from "./navbar.js";
import type { Section } from "./sections.js";
import type { FooterProps } from "../components/Footer.js";
import type { ExperienceTypesConfig } from "../utils/index.js";

export interface LocaleConfig {
  /**
   * Language code (e.g., "en", "zh")
   * 语言代码
   */
  lang: string;

  /**
   * Website title
   * 网站标题
   */
  title?: string;

  /**
   * Website description
   * 网站描述
   */
  description?: string;

  /**
   * Language name (e.g., "English", "简体中文")
   * 语言名称
   */
  langName?: string;

  /**
   * Hero section configuration
   * 首屏区域配置
   */
  hero: HeroConfig;

  /**
   * Navbar configuration
   * 导航栏配置
   */
  navbar?: NavbarConfig;

  /**
   * Content to display
   * 要显示的内容
   */
  sections: Section[];

  /**
   * Footer configuration
   * 页脚配置
   */
  footer?: Partial<FooterProps>;

  /**
   * UI translation strings
   * 界面翻译字符串
   */
  ui?: {
    /**
     * Tooltip text for theme toggler
     * 主题切换器的提示文本
     */
    themeToggle?: string;
    /**
     * Label for contact
     * 联系方式标签
     */
    contacts?: string;
    /**
     * Label for detail link
     * 详情链接标签
     */
    details?: string;
  };
}

export interface GlobalConfig {
  /**
   * Experience types configuration
   *
   * 经历类型配置
   */
  experienceTypes?: ExperienceTypesConfig;
}

export interface Config {
  /**
   * Global configuration
   *
   * 全局配置
   */
  config?: GlobalConfig;

  locales: Record<string, LocaleConfig>;
}
