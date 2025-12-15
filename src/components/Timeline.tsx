import type { FC } from "react";
import type { TimelineItem } from "../types.js";
import { Icon } from "./Icon.js";
import MarkdownText from "./MarkdownText.js";

export interface TimelineProps {
  /**
   * List of timeline items to display
   * 要显示的时间轴项列表
   */
  items: TimelineItem[];
}

/**
 * Timeline component
 *
 * Displays a list of events or news items in a vertical list format.
 *
 * 时间轴组件
 *
 * 以垂直列表格式显示事件或新闻项列表。
 */
export const Timeline: FC<TimelineProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 glass rounded-3xl border border-slate-100 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
        >
          <div className="flex-shrink-0 w-24">
            <span className="text-base font-black text-blue-600/40 dark:text-blue-400/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-widest">
              {item.year}
            </span>
          </div>

          <div className="flex-1">
            <p className="text-slate-700 dark:text-slate-300 font-bold text-lg leading-relaxed">
              <MarkdownText content={item.content} />
            </p>
          </div>

          {item.link && (
            <div className="flex-shrink-0">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-white dark:group-hover:text-white shadow-sm transition-all active:scale-95"
              >
                {item.linkText ||
                  (item.link.includes("riken") ? "Press" : "Detail")}
                <Icon
                  icon="fa-solid fa-arrow-up-right-from-square"
                  className="text-[10px]"
                />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
