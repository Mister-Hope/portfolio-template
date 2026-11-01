// oxlint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/prefer-tag-over-role -- custom modal: Escape/arrow keys are handled globally, the backdrop click is a mouse-only shortcut, and the wrapper is not focusable; a native <dialog> would change the existing layout/CSS.
import { useCallback, useEffect, useRef } from "react";
import type { FC } from "react";

import { resolveAssetUrl } from "../utils/index.js";
import type { GalleryItem } from "./GalleryCard.js";
import { Icon } from "./Icon.js";
import { RichContent } from "./RichContent.js";

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Lightbox rendered as an accessible modal dialog.
 *
 * 可访问的灯箱对话框。
 */
export const LightBox: FC<{
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ item, onClose, onPrev, onNext }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Focus the dialog on open, lock background scroll and restore focus on close.
  useEffect(() => {
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const { overflow } = document.body.style;

    document.body.style.overflow = "hidden";

    return (): void => {
      document.body.style.overflow = overflow;
      restoreFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;

      if (!dialog) return;

      const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];

      if (focusable.length === 0) return;

      const [first] = focusable;
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

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

  const hasMeta = Boolean(item.location) || Boolean(item.date);

  return (
    <div className="lightbox-overlay" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="group lightbox-container"
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={stopPropagation}
      >
        <button
          ref={closeButtonRef}
          className="lightbox-close"
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <Icon icon="xmark" className="text-3xl" />
        </button>

        <button
          className="lightbox-nav lightbox-nav-left"
          type="button"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <Icon icon="chevron-left" className="text-4xl" />
        </button>

        <button
          className="lightbox-nav lightbox-nav-right"
          type="button"
          onClick={handleNext}
          aria-label="Next image"
        >
          <Icon icon="chevron-right" className="text-4xl" />
        </button>

        <div className="lightbox-image-wrapper">
          <img
            src={resolveAssetUrl(item.url)}
            alt={item.title}
            className="lightbox-image"
            loading="lazy"
            width={item.width}
            height={item.height}
          />
        </div>

        <div className="lightbox-content">
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
          {item.description ? (
            <RichContent content={item.description} className="lightbox-description" block />
          ) : null}
        </div>
      </div>
    </div>
  );
};
