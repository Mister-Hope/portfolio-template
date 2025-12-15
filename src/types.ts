/**
 * Portfolio media link configuration
 * 个人作品集媒体链接配置
 */
export interface PortfolioMedia {
  /**
   * FontAwesome icon class name (e.g., "fab fa-github")
   * FontAwesome 图标类名 (例如 "fab fa-github")
   */
  icon: string;
  /**
   * Display name of the media
   * 媒体显示名称
   */
  name: string;
  /**
   * URL link to the profile
   * 个人主页链接地址
   */
  link: string;
}

/**
 * Supported content block types
 * 支持的内容块类型
 */
export type ContentBlockType =
  | "profile"
  | "experience"
  | "banner"
  | "timeline"
  | "cards"
  | "list"
  | "gallery"
  | "paragraph";

/**
 * Experience item (work or study)
 * 经历项 (工作或学习)
 */
export interface ExperienceItem {
  /**
   * Type of experience
   * 经历类型
   */
  type: "study" | "work";
  /**
   * Place/Institution name
   * 地点/机构名称
   */
  place: string;
  /**
   * Job title or Degree
   * 职位或学位
   */
  title?: string;
  /**
   * Time period (e.g., "2020 - 2024")
   * 时间段 (例如 "2020 - 2024")
   */
  time: string;
  /**
   * Main content/description (Markdown supported)
   * 主要内容/描述 (支持 Markdown)
   */
  content?: string;
  /**
   * Additional detailed description (Markdown supported)
   * 额外详细描述 (支持 Markdown)
   */
  description?: string;
  /**
   * Optional custom icon
   * 可选自定义图标
   */
  icon?: string;
}

/**
 * Card item for projects or highlights
 * 项目或亮点的卡片项
 */
export interface CardItem {
  /**
   * Card title
   * 卡片标题
   */
  title: string;
  /**
   * Card subtitle
   * 卡片副标题
   */
  subtitle: string;
  /**
   * Link URL
   * 链接地址
   */
  link: string;
  /**
   * Optional description
   * 可选描述
   */
  description?: string;
}

/**
 * Timeline item for news or events
 * 新闻或事件的时间轴项
 */
export interface TimelineItem {
  /**
   * Year or date string
   * 年份或日期字符串
   */
  year: string;
  /**
   * Event content (Markdown supported)
   * 事件内容 (支持 Markdown)
   */
  content: string;
  /**
   * Optional link URL
   * 可选链接地址
   */
  link?: string;
  /**
   * Text for the link
   * 链接文本
   */
  linkText?: string;
}

/**
 * List item for publications, awards, etc.
 * 出版物、奖项等的列表项
 */
export interface ListItem {
  /**
   * Item text (Markdown supported)
   * 列表项文本 (支持 Markdown)
   */
  text: string;
  /**
   * Optional link URL
   * 可选链接地址
   */
  link?: string;
}

/**
 * Gallery item for photos
 * 照片画廊项
 */
export interface GalleryItem {
  /**
   * Image URL
   * 图片链接
   */
  url: string;
  /**
   * Image title
   * 图片标题
   */
  title: string;
  /**
   * Location where photo was taken
   * 拍摄地点
   */
  location?: string;
  /**
   * Date of the photo
   * 拍摄日期
   */
  date?: string;
  /**
   * Description or story (Markdown supported)
   * 描述或故事 (支持 Markdown)
   */
  description?: string;
}

/**
 * Configuration for a content block
 * 内容块配置
 */
export interface ContentBlock {
  /**
   * Type of the content block
   * 内容块类型
   */
  type: ContentBlockType;
  /**
   * Unique identifier for the block (used for navigation)
   * 块的唯一标识符 (用于导航)
   */
  id: string;
  /**
   * Section title
   * 章节标题
   */
  title: string;
  /**
   * Section icon class
   * 章节图标类名
   */
  icon?: string;
  /**
   * Section subtitle
   * 章节副标题
   */
  subtitle?: string;
  /**
   * Data specific to the block type
   * 特定于块类型的数据
   */
  data?: any;
  /**
   * Display configuration options
   * 显示配置选项
   */
  config?: {
    /**
     * List type (unordered or ordered)
     * 列表类型 (无序或有序)
     */
    listType?: "ul" | "ol";
    /**
     * List bullet style
     * 列表符号样式
     */
    listStyle?: "circle" | "square" | "check" | "none";
    /**
     * Number of columns
     * 列数
     */
    columns?: number;
    /**
     * Accent color
     * 强调色
     */
    accentColor?: string;
  };
}

/**
 * Navigation link configuration
 * 导航链接配置
 */
export interface NavLink {
  /**
   * Display label
   * 显示标签
   */
  label: string;
  /**
   * Anchor ID to scroll to
   * 要滚动到的锚点 ID
   */
  anchor: string;
}

/**
 * Main application configuration
 * 应用程序主配置
 */
export interface Config {
  /**
   * User name
   * 用户姓名
   */
  name: string;
  /**
   * Welcome message
   * 欢迎语
   */
  welcome: string;
  /**
   * Array of titles/roles (for typewriter effect)
   * 头衔/角色数组 (用于打字机效果)
   */
  titles: string[];
  /**
   * Avatar image URL
   * 头像图片链接
   */
  avatar: string;
  /**
   * Background image URL
   * 背景图片链接
   */
  bgImage: string;
  /**
   * Social media links
   * 社交媒体链接
   */
  medias: PortfolioMedia[];
  /**
   * Content blocks to display
   * 要显示的内容块
   */
  contents: ContentBlock[];
  /**
   * Footer configuration
   * 页脚配置
   */
  footer: {
    /**
     * Copyright text
     * 版权文本
     */
    copyright: string;
    /**
     * Optional footer description
     * 可选页脚描述
     */
    description?: string;
  };
  /**
   * Navbar configuration
   * 导航栏配置
   */
  navbar?: {
    /**
     * Navigation links
     * 导航链接
     */
    links: NavLink[];
  };
}
