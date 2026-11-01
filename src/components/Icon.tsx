import { Icon as Iconify } from "@iconify/react";
import { useMemo } from "react";
import type { FC, HTMLAttributes } from "react";

import { resolveAssetUrl } from "../utils/index.js";

export interface IconProps extends HTMLAttributes<HTMLElement> {
  /**
   * The icon name or image URL
   *
   * - Iconify name: "mdi:home", "fa7-solid:user"
   * - Image URL: "https://example.com/icon.png", "/icons/my-icon.svg"
   */
  icon: string;
}

const resolveIcon = (icon: string): string => {
  // If it already has a prefix (e.g. "mdi:home"), return as is
  if (icon.includes(":")) return icon;

  // Strip fa- prefix if present (e.g. "fa-user" -> "user")
  const cleanName = icon.replace(/^fa-/u, "");

  // Default to fa7-solid
  return `fa7-solid:${cleanName}`;
};

/**
 * Icon Component
 *
 * Supports Iconify icons and image URLs.
 */
export const Icon: FC<IconProps> = ({ icon, className, style, ...props }) => {
  const iconStyle = useMemo(
    () => ({
      display: "inline-flex",
      minWidth: "1em",
      minHeight: "1em",
      alignItems: "center",
      justifyContent: "center",
      verticalAlign: "-0.125em",
      ...style,
    }),
    [style],
  );

  // Check for image URL
  if (icon.startsWith("/") || icon.startsWith("http")) {
    return (
      <img
        src={resolveAssetUrl(icon)}
        alt=""
        className={`icon-img ${className ?? ""}`}
        loading="lazy"
        style={style}
        // oxlint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    );
  }

  // @iconify/react renders an empty <span> until the icon data is loaded from the Iconify API.
  // That placeholder has no size, which causes layout shift when icons appear. Reserve the em-box
  // on a wrapper so the prerendered HTML and the first client paint already occupy the final size;
  // `1em` scales with the font-size applied through `className`.
  return (
    <span
      className={className}
      style={iconStyle}
      // oxlint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <Iconify icon={resolveIcon(icon)} width="1em" height="1em" />
    </span>
  );
};
