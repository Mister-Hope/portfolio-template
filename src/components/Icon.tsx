import type { FC, HTMLAttributes } from "react";

export interface IconProps extends HTMLAttributes<HTMLElement> {
  /**
   * The icon class name (e.g. "fa-solid fa-user" or "fab fa-github")
   * 图标类名 (例如 "fa-solid fa-user" 或 "fab fa-github")
   */
  icon: string;
}

/**
 * FontAwesome Icon Component
 * FontAwesome 图标组件
 */
export const Icon: FC<IconProps> = ({ icon, className, ...props }) => {
  return <i className={`${icon} ${className || ""}`} {...props} />;
};
