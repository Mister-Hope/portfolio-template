import { useState, useCallback, useEffect } from "react";
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

const GalleryCard: FC<{
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

const Lightbox: FC<{
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ item, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPrev, onNext, onClose]);

  const stopPropagation = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const handlePrev = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onPrev();
    },
    [onPrev],
  );

  const handleNext = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onNext();
    },
    [onNext],
  );

  const handleClose = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onClose();
    },
    [onClose],
  );

  const hasMeta = Boolean(item.location) || Boolean(item.date);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-nav lightbox-nav-left" type="button" onClick={handlePrev}>
        <Icon icon="chevron-left" className="text-4xl" />
      </button>

      <button className="lightbox-nav lightbox-nav-right" type="button" onClick={handleNext}>
        <Icon icon="chevron-right" className="text-4xl" />
      </button>

      <div className="group lightbox-container">
        <button className="lightbox-close" type="button" onClick={handleClose}>
          <Icon icon="xmark" className="text-3xl" />
        </button>
        <div className="lightbox-image-wrapper">
          <img src={item.url} alt={item.title} className="lightbox-image" loading="lazy" />
        </div>
        <div className="lightbox-content" onClick={stopPropagation}>
          <div className="space-y-1">
            <h3 className="lightbox-title">{item.title}</h3>

            {hasMeta && (
              <p className="lightbox-meta">
                {Boolean(item.location) && (
                  <>
                    <Icon icon="location-dot" />
                    {item.location}
                  </>
                )}
                {Boolean(item.location) && Boolean(item.date) && " • "}
                {item.date?.toString()}
              </p>
            )}
          </div>
          {Boolean(item.description) && <p className="lightbox-description">{item.description}</p>}
        </div>
      </div>
    </div>
  );
};

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + items.length) % items.length));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % items.length));
  }, [items.length]);

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <GalleryCard key={item.url} item={item} index={index} onSelect={setSelectedIndex} />
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          item={items[selectedIndex]}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
};
