import { useState } from "react";
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

/**
 * Gallery component
 *
 * Displays a masonry-style grid of images with a lightbox for viewing details.
 *
 * 画廊组件
 *
 * 显示瀑布流风格的图片网格，并带有用于查看详情的灯箱。
 */
export const Gallery: FC<GalleryProps> = ({ items }) => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, idx) => (
          <div key={idx} className="group gallery-item" onClick={() => setSelected(item)}>
            <img src={item.url} alt={item.title} className="gallery-image" loading="lazy" />
            <div className="gallery-overlay">
              <h4 className="gallery-title">{item.title}</h4>
              {(item.location || item.date) && (
                <p className="gallery-meta">
                  {item.location && (
                    <>
                      <Icon icon="location-dot" className="text-xs" />
                      {item.location}
                    </>
                  )}
                  {item.location && item.date && "•"}
                  {item.date}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="lightbox-overlay" onClick={() => setSelected(null)}>
          <div className="group lightbox-container" onClick={(event) => event.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelected(null)}>
              <Icon icon="xmark" className="text-3xl" />
            </button>
            <div className="lightbox-image-wrapper">
              <img
                src={selected.url}
                alt={selected.title}
                className="lightbox-image"
                loading="lazy"
              />
            </div>
            <div className="lightbox-content">
              <div className="space-y-1">
                <h3 className="lightbox-title">{selected.title}</h3>
                {(selected.location || selected.date) && (
                  <p className="lightbox-meta">
                    {selected.location && (
                      <>
                        <Icon icon="location-dot" />
                        {selected.location}
                      </>
                    )}
                    {selected.location && selected.date && "•"}
                    {selected.date?.toString()}
                  </p>
                )}
              </div>
              {selected.description && (
                <p className="lightbox-description">{selected.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
