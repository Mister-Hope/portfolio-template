// oxlint-disable jsx-a11y/prefer-tag-over-role -- the card contains block-level content (image + heading + meta), which a <button> cannot legally wrap; the wrapper keeps role/tabIndex/keyboard handling.
import { useCallback } from "react";
import type { FC } from "react";

import { resolveAssetUrl } from "../utils/index.js";
import { Icon } from "./Icon.js";

/**
 * Gallery item for photos
 *
 * 照片画廊项
 */
export interface GalleryItem {
  /**
   * Image URL
   *
   * 图片链接
   */
  url: string;
  /**
   * Image title
   *
   * 图片标题
   */
  title: string;
  /**
   * Location where photo was taken
   *
   * 拍摄地点
   */
  location?: string;
  /**
   * Date of the photo
   *
   * 拍摄日期
   */
  date?: string | number;
  /**
   * Description or story (Markdown supported)
   *
   * 描述或故事 (支持 Markdown)
   */
  description?: string;
  /**
   * Intrinsic image width in pixels
   *
   * Providing it together with `height` is strongly recommended: it reserves space and avoids
   * layout shift while the image loads.
   *
   * 图片原始宽度（像素）。强烈建议与 `height` 一起设置，可预留空间并避免图片加载时的布局抖动。
   */
  width?: number;
  /**
   * Intrinsic image height in pixels
   *
   * 图片原始高度（像素）。强烈建议与 `width` 一起设置。
   */
  height?: number;
}

export interface GalleryProps {
  /**
   * List of gallery items (photos)
   *
   * 画廊项 (照片) 列表
   */
  items: GalleryItem[];
}

export const GalleryCard: FC<{
  item: GalleryItem;
  index: number;
  onSelect: (index: number) => void;
}> = ({ item, index, onSelect }) => {
  const handleSelect = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect(index);
      }
    },
    [index, onSelect],
  );

  const hasMeta = Boolean(item.location) || Boolean(item.date);

  return (
    <div
      className="group gallery-item"
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={item.title}
    >
      <img
        src={resolveAssetUrl(item.url)}
        alt={item.title}
        className="gallery-image"
        loading="lazy"
        width={item.width}
        height={item.height}
      />
      <div className="gallery-overlay">
        <h3 className="gallery-title">{item.title}</h3>
        {hasMeta && (
          <p className="gallery-meta">
            {Boolean(item.location) && (
              <>
                <Icon icon="location-dot" className="text-xs" />
                {item.location}
              </>
            )}
            {Boolean(item.location) && Boolean(item.date) && " • "}
            {item.date}
          </p>
        )}
      </div>
    </div>
  );
};
