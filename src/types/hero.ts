/**
 * Portfolio media link configuration
 * 个人作品集媒体链接配置
 */
export interface HeroMedia {
  /**
   * Icon name (e.g., "mdi:github", "github") or image URL
   * 图标名称 (例如 "mdi:github", "github") 或图片链接
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
 * Hero section configuration
 * 首屏区域配置
 */
export interface HeroConfig {
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
  medias?: HeroMedia[];
}
