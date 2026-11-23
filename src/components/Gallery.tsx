import { useState, useCallback } from "react";
import type { FC } from "react";

import type { GalleryItem } from "./GalleryCard.js";
import { GalleryCard } from "./GalleryCard.js";
import { LightBox } from "./LightBox.js";

export interface GalleryProps {
  /**
   * List of gallery items (photos)
   *
   * 画廊项 (照片) 列表
   */
  items: GalleryItem[];
  /**
   * UI labels for the gallery lightbox
   *
   * 画廊灯箱的 UI 标签
   */
  ui?: {
    closeLightbox?: string;
    previousImage?: string;
    nextImage?: string;
  };
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
export const Gallery: FC<GalleryProps> = ({ items, ui }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev == null ? null : (prev - 1 + items.length) % items.length));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev == null ? null : (prev + 1) % items.length));
  }, [items.length]);

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <GalleryCard key={item.url} item={item} index={index} onSelect={setSelectedIndex} />
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex != null && (
        <LightBox
          item={items[selectedIndex]}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          ui={ui}
        />
      )}
    </>
  );
};
