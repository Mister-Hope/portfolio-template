import fs from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";

/**
 * Intrinsic image dimensions in pixels.
 *
 * 图片的原始宽高（像素）。
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Whether a URL points to a file in the `public/` directory.
 *
 * 判断 URL 是否指向 `public/` 目录中的文件。
 *
 * @param url - Image URL from the config
 * @returns `true` for a local `/...` path (but not a protocol-relative `//...` URL)
 */
const isLocalPublicUrl = (url: string): boolean => url.startsWith("/") && !url.startsWith("//");

/**
 * Create a cached resolver that reads intrinsic dimensions of local `public/` images.
 *
 * 创建带缓存的解析器，用于读取 `public/` 下本地图片的原始宽高。
 *
 * Remote URLs, protocol-relative URLs, missing files, unsupported formats and paths outside
 * `public/` all resolve to `null` so callers can fall back to user-provided dimensions.
 *
 * 远程 URL、协议相对 URL、缺失文件、不支持的格式以及 `public/` 之外的路径都会返回 `null`。
 *
 * @param root - Project root directory
 * @returns Resolver for a config image URL
 */
export const createImageDimensionsResolver = (
  root: string,
): ((url: string) => ImageDimensions | null) => {
  const publicDir = path.resolve(root, "public");
  const cache = new Map<string, ImageDimensions | null>();

  const resolve = (url: string): ImageDimensions | null => {
    if (!isLocalPublicUrl(url)) return null;

    const [cleanUrl] = url.split(/[?#]/u);

    let relativePath: string;

    try {
      relativePath = decodeURIComponent(cleanUrl.replace(/^\/+/u, ""));
    } catch {
      return null;
    }

    const filePath = path.resolve(publicDir, relativePath);
    const pathFromPublic = path.relative(publicDir, filePath);

    if (pathFromPublic.startsWith("..") || path.isAbsolute(pathFromPublic)) return null;

    if (cache.has(filePath)) return cache.get(filePath) ?? null;

    try {
      const { width, height } = imageSize(fs.readFileSync(filePath));
      const dimensions = width && height ? { width, height } : null;

      cache.set(filePath, dimensions);

      return dimensions;
    } catch {
      cache.set(filePath, null);

      return null;
    }
  };

  return resolve;
};
