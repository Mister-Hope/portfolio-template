import { useState } from "react";
import type { FC } from "react";
import type { GalleryItem } from "../types.js";
import { Icon } from "./Icon.js";

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
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="break-inside-avoid relative group cursor-zoom-in rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            onClick={() => setSelected(item)}
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h4 className="text-white font-bold text-lg">{item.title}</h4>
              <p className="text-white/70 dark:text-white/60 text-sm flex items-center gap-2">
                <Icon icon="fa-solid fa-location-dot" className="text-xs" />
                {item.location} {item.date && `• ${item.date}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 dark:bg-slate-950/98 backdrop-blur-xl flex items-center justify-center p-6 sm:p-12 cursor-zoom-out"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-5xl w-full relative group"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelected(null)}
            >
              <Icon icon="fa-solid fa-xmark" className="text-3xl" />
            </button>
            <div className="bg-white/5 p-2 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={selected.url}
                alt={selected.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
              />
            </div>
            <div className="mt-8 text-white space-y-4 max-w-3xl mx-auto text-center">
              <div className="space-y-1">
                <h3 className="text-3xl font-black tracking-tight">
                  {selected.title}
                </h3>
                <p className="text-blue-400 dark:text-blue-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                  <Icon icon="fa-solid fa-location-dot" />
                  {selected.location} {selected.date && `• ${selected.date}`}
                </p>
              </div>
              {selected.description && (
                <p className="text-slate-300 dark:text-slate-400 text-lg leading-relaxed font-medium italic bg-white/5 p-6 rounded-3xl border border-white/10">
                  {selected.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
