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

export interface NavbarConfig {
  /**
   * Navigation links
   * 导航链接
   */
  links: NavLink[];
}
