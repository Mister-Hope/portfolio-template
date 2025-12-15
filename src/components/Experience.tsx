import type { FC } from "react";
import type { ExperienceItem } from "../types.js";
import MarkdownText from "./MarkdownText.js";

export const Experience: FC<{ items: ExperienceItem[] }> = ({ items }) => {
  return (
    <div className="space-y-10 pl-0 md:pl-4">
      {items.map((item, idx) => (
        <div key={idx} className="relative pl-10 md:pl-12 group">
          {/* Individual Timeline Line segment */}
          {idx !== items.length - 1 && (
            <div className="absolute left-3.5 top-8 bottom-[-2.5rem] w-px bg-slate-200 dark:bg-slate-800 z-0" />
          )}

          {/* Timeline Node */}
          <div
            className={`absolute left-0 top-1 w-7 h-7 md:w-8 md:h-8 rounded-xl md:rounded-2xl border-4 border-white dark:border-slate-950 shadow-sm flex items-center justify-center z-10 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 ${item.type === "study" ? "bg-indigo-600" : "bg-emerald-600"}`}
          >
            <i
              className={`fa-solid ${item.type === "study" ? "fa-book-open" : "fa-briefcase"} text-[9px] md:text-[10px] text-white`}
            />
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            {/* Top Meta: Time & Location */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <span className="text-[10px] md:text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg">
                {item.time}
              </span>
              <div className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 shadow-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                <i className="fa-solid fa-location-dot" />
                {item.place}
              </div>
            </div>

            {/* Content Box */}
            <div className="glass p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-500/5 transition-all duration-700">
              <div className="flex items-start gap-4 md:gap-6">
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${item.type === "study" ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"}`}
                >
                  <i
                    className={`fa-solid ${item.icon || (item.type === "study" ? "fa-graduation-cap" : "fa-briefcase")} text-lg md:text-2xl`}
                  />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words">
                    <MarkdownText content={item.title || ""} />
                  </h3>
                  {item.content && (
                    <div className="text-slate-600 dark:text-slate-300 font-bold text-sm md:text-lg leading-snug">
                      <MarkdownText content={item.content} />
                    </div>
                  )}
                  {item.description && (
                    <div className="pt-1 md:pt-2">
                      <p className="text-slate-400 dark:text-slate-500 text-xs md:text-base font-medium leading-relaxed italic">
                        <MarkdownText content={item.description} />
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
