import type { FooterProps } from "../components/Footer.js";
import type { ExperienceTypesConfig } from "../utils/index.js";
import type { HeroConfig } from "./hero.js";
import type { NavbarConfig } from "./navbar.js";
import type { Section } from "./sections.js";

/**
 * A single markdown-it plugin entry: `pluginName` or `[pluginName, options?]`
 *
 * - `pluginName`: npm package name to `import()`.
 * - `options` (optional): passed as the second argument to `md.use()`.
 *
 * markdown-it 插件条目：`插件包名` 或 `[插件包名, 选项?]`
 *
 * - `pluginName`：通过 `import()` 加载的 npm 包名。
 * - `options`（可选）：作为第二个参数传递给 `md.use()` 的选项。
 */
// oxlint-disable-next-line typescript/no-explicit-any
export type MdItPluginEntry = string | [pluginName: string, options?: any];

/**
 * markdown-it plugin configuration.
 * - Array form (all config formats): [pluginName | [pluginName, options?], ...]
 * - Function form (JS/TS configs only): (md) => { md.use(plugin) }
 *
 * markdown-it 插件配置。
 * - 数组形式（所有配置格式）：[插件包名 | [插件包名, 选项?], ...]
 * - 函数形式（仅 JS/TS 配置）：(md) => { md.use(plugin) }
 */
// oxlint-disable-next-line typescript/no-explicit-any, typescript/explicit-module-boundary-types
export type MdItConfig = MdItPluginEntry[] | ((md: any) => void);

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

  /**
   * markdown-it plugin configuration.
   * - Array form (all config formats): [pluginName | [pluginName, options?], ...]
   * - Function form (JS/TS configs only): (md) => { md.use(plugin) }
   *
   * markdown-it 插件配置。
   * - 数组形式（所有配置格式）：[插件包名 | [插件包名, 选项?], ...]
   * - 函数形式（仅 JS/TS 配置）：(md) => { md.use(plugin) }
   */
  mdIt?: MdItConfig;
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
