import { useCallback, useEffect } from "react";
import type { FC } from "react";
import { Icon } from "./Icon.js";
import type { GalleryItem } from "./GalleryCard.js";

export const LightBox: FC<{
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
