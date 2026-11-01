// oxlint-disable react/jsx-props-no-spreading -- forward standard <img> attributes (className/loading/width/…) to the rendered image(s).
import type { FC, ImgHTMLAttributes } from "react";

import type { AdaptiveImageSource } from "../types/index.js";
import { resolveAssetUrl } from "../utils/index.js";

export interface AdaptiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: AdaptiveImageSource;
}

const joinClassName = (...classes: (string | undefined)[]): string =>
  classes.filter(Boolean).join(" ");

/**
 * Adaptive Image Component
 *
 * Supports both a single image URL and a light/dark mode image object. Light/dark variants are
 * switched with CSS classes (`.dark` on `<html>`) so they follow the in-site theme toggle instead
 * of the OS preference, and no client-side JavaScript is involved.
 *
 * 自适应图片组件：支持单张图片或亮/暗两套图片。亮暗切换使用 CSS（`<html>` 上的 `.dark` 类）， 因此跟随站内主题切换而不是系统偏好，且不依赖客户端 JS。
 */
export const AdaptiveImage: FC<AdaptiveImageProps> = ({ src, alt = "", className, ...props }) => {
  if (typeof src === "string")
    return <img src={resolveAssetUrl(src)} alt={alt} className={className} {...props} />;

  return (
    <>
      <img
        src={resolveAssetUrl(src.light)}
        alt={alt}
        className={joinClassName(className, "dark:hidden")}
        {...props}
      />
      <img
        src={resolveAssetUrl(src.dark)}
        alt={alt}
        className={joinClassName(className, "hidden dark:block")}
        {...props}
      />
    </>
  );
};
