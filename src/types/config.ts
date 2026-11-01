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
 * Markdown-it 插件条目：`插件包名` 或 `[插件包名, 选项?]`
 *
 * - `pluginName`：通过 `import()` 加载的 npm 包名。
 * - `options`（可选）：作为第二个参数传递给 `md.use()` 的选项。
 */
// oxlint-disable-next-line typescript/no-explicit-any
export type MdItPluginEntry = string | [pluginName: string, options?: any];

/**
 * Markdown-it plugin configuration.
 *
 * - Array form (all config formats): [pluginName | [pluginName, options?], ...]
 * - Function form (JS/TS configs only): (md) => { md.use(plugin) }
 *
 * Markdown-it 插件配置。
 *
 * - 数组形式（所有配置格式）：[插件包名 | [插件包名, 选项?], ...]
 * - 函数形式（仅 JS/TS 配置）：(md) => { md.use(plugin) }
 */
// oxlint-disable-next-line typescript/no-explicit-any
export type MdItConfig = MdItPluginEntry[] | ((md: any) => void);

export interface LocaleConfig {
  /**
   * Language code (e.g., "en", "zh")
   *
   * 语言代码
   */
  lang: string;

  /**
   * Website title
   *
   * 网站标题
   */
  title?: string;

  /**
   * Website description
   *
   * 网站描述
   */
  description?: string;

  /**
   * Language name (e.g., "English", "简体中文")
   *
   * 语言名称
   */
  langName?: string;

  /**
   * Hero section configuration
   *
   * 首屏区域配置
   */
  hero: HeroConfig;

  /**
   * Navbar configuration
   *
   * 导航栏配置
   */
  navbar?: NavbarConfig;

  /**
   * Content to display
   *
   * 要显示的内容
   */
  sections: Section[];

  /**
   * Footer configuration
   *
   * 页脚配置
   */
  footer?: Partial<FooterProps>;

  /**
   * UI translation strings
   *
   * 界面翻译字符串
   */
  ui?: {
    /**
     * Tooltip text for theme toggler
     *
     * 主题切换器的提示文本
     */
    themeToggle?: string;
    /**
     * Label for contact
     *
     * 联系方式标签
     */
    contacts?: string;
    /**
     * Label for detail link
     *
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
   * Markdown-it plugin configuration.
   *
   * - Array form (all config formats): [pluginName | [pluginName, options?], ...]
   * - Function form (JS/TS configs only): (md) => { md.use(plugin) }
   *
   * Markdown-it 插件配置。
   *
   * - 数组形式（所有配置格式）：[插件包名 | [插件包名, 选项?], ...]
   * - 函数形式（仅 JS/TS 配置）：(md) => { md.use(plugin) }
   */
  mdIt?: MdItConfig;
}

export interface Config {
  /**
   * Deployment base path.
   *
   * Keep `"/"` when the site is served from a domain root (e.g. Netlify/Vercel custom domain). Set
   * it to the sub-path (e.g. `"/my-repository/"`) when deploying to a GitHub Pages project site
   * (`https://<user>.github.io/<repository>/`) or any other non-root path.
   *
   * 部署基础路径。
   *
   * 站点部署在域名根路径（如 Netlify/Vercel）时保持 `"/"`。
   *
   * 部署到 GitHub Pages 项目页等子路径时，设置为对应子路径（例如 `"/my-repository/"`）。
   */
  base?: string;

  /**
   * Public site URL used for absolute links (canonical, hreflang, sitemap, Open Graph).
   *
   * Include the deployment base path when the site is served from a sub-path, e.g.
   * `"https://<user>.github.io/<repository>"`. Leave it empty to skip absolute URLs.
   *
   * 站点公开 URL，用于 canonical、hreflang、sitemap、Open Graph 等绝对链接。
   *
   * 站点部署在子路径时需包含 base 路径，例如 `"https://<user>.github.io/<repository>"`。不填则跳过绝对链接。
   */
  siteUrl?: string;

  /**
   * Favicon URL (absolute URL or `public/` path). Defaults to `"/favicon.svg"`; set it to `""` to
   * disable the tag.
   *
   * 网站图标 URL（完整 URL 或 `public/` 路径），默认 `"/favicon.svg"`；设为 `""` 可禁用。
   */
  favicon?: string;

  /**
   * Social preview image (absolute URL or `public/` path) used for `og:image`/`twitter:image`.
   *
   * Provide a 1200×630 PNG/JPEG for reliable previews; AVIF is not supported by all social
   * crawlers. Defaults to the hero avatar when omitted.
   *
   * 社交分享图（完整 URL 或 `public/` 路径），用于 `og:image`/`twitter:image`。
   *
   * 建议提供 1200×630 的 PNG/JPEG；部分社交爬虫不支持 AVIF。不填时回退到头像。
   */
  ogImage?: string;

  /**
   * Global configuration
   *
   * 全局配置
   */
  config?: GlobalConfig;

  locales: Record<string, LocaleConfig>;
}
