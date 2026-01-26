import { Icon as Iconify } from "@iconify/react";
import type { FC, HTMLAttributes } from "react";

export interface IconProps extends HTMLAttributes<HTMLElement> {
  /**
   * The icon name or image URL
   * - Iconify name: "mdi:home", "fa7-solid:user"
   * - Image URL: "https://example.com/icon.png", "/icons/my-icon.svg"
   */
  icon: string;
}

const resolveIcon = (icon: string): string => {
  // If it already has a prefix (e.g. "mdi:home"), return as is
  if (icon.includes(":")) return icon;

  // Strip fa- prefix if present (e.g. "fa-user" -> "user")
  const cleanName = icon.replace(/^fa-/, "");

  // Default to fa7-solid
  return `fa7-solid:${cleanName}`;
};

/**
 * Icon Component
 *
 * Supports Iconify icons and image URLs.
 */
export const Icon: FC<IconProps> = ({ icon, className, style, ...props }) => {
  // Check for image URL
  if (icon.startsWith("/") || icon.startsWith("http")) {
    const isExternal = icon.startsWith("http");
    // Handle base path for local images
    const src = isExternal ? icon : `${import.meta.env.BASE_URL.replace(/\/$/, "") || ""}${icon}`;

    return (
      <img
        src={src}
        alt=""
        className={`icon-img ${className ?? ""}`}
        loading="lazy"
        style={style}
        {...props}
      />
    );
  }

  return (
    <Iconify
      icon={resolveIcon(icon)}
      className={className}
      style={style}
      // oxlint-disable-next-line typescript/no-explicit-any
      {...(props as any)}
    />
  );
};
