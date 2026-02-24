import { useCallback } from "react";
import type { FC } from "react";
import { Icon } from "./Icon.js";

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
  date?: string | number;
  /**
   * Description or story (Markdown supported)
   * 描述或故事 (支持 Markdown)
   */
  description?: string;
}

export interface GalleryProps {
  /**
   * List of gallery items (photos)
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

  const hasMeta = Boolean(item.location) || Boolean(item.date);

  return (
    <div className="group gallery-item" onClick={handleSelect}>
      <img src={item.url} alt={item.title} className="gallery-image" loading="lazy" />
      <div className="gallery-overlay">
        <h4 className="gallery-title">{item.title}</h4>
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
