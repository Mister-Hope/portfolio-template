import type { FC, ImgHTMLAttributes } from "react";
import type { AdaptiveImageSource } from "../types/index.js";

export interface AdaptiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: AdaptiveImageSource;
}

/**
 * Adaptive Image Component
 *
 * Supports both a single image URL and a light/dark mode image object.
 */
export const AdaptiveImage: FC<AdaptiveImageProps> = ({ src, alt = "", ...props }) => {
  // oxlint-disable-next-line react/jsx-props-no-spreading
  if (typeof src === "string") return <img src={src} alt={alt} {...props} />;

  return (
    <picture className={props.className}>
      <source media="(prefers-color-scheme: dark)" srcSet={src.dark} />
      {/* oxlint-disable-next-line react/jsx-props-no-spreading */}
      <img src={src.light} alt={alt} {...props} />
    </picture>
  );
};
