import type { FC } from "react";
import { Icon } from "./Icon.js";
import { RichContent } from "./RichContent.js";

/**
 * Timeline item for news or events
 * 新闻或事件的时间轴项
 */
export interface TimelineItem {
  /**
   * Year or date string
   * Year or date (string or number)
   * 年份或日期（字符串或数字）
   */
  year: string | number;
  /**
   * Event content (Markdown supported)
   * 事件内容 (支持 Markdown)
   */
  content: string;
  /**
   * Optional link URL
   * 可选链接地址
   */
  link?: string;
  /**
   * Text for the link
   * 链接文本
   */
  linkText?: string;
}

export interface TimelineProps {
  /**
   * List of timeline items to display
   * 要显示的时间轴项列表
   */
  items: TimelineItem[];

  ui?: {
    details?: string;
  };
}

/**
 * Timeline component
 *
 * Displays a list of events or news items by tune
 *
 * 时间轴组件
 *
 * 按时间顺序显示事件或新闻项的列表
 */
export const Timeline: FC<TimelineProps> = ({ items, ui }) => {
  return (
    <div className="timeline">
      {items.map((item, idx) => (
        <div key={idx} className="group timeline-item">
          {/* Timeline Line */}
          {idx !== items.length - 1 && <div className="timeline-line" />}

          {/* Timeline Node - Simple small solid primary dot */}
          <div className="timeline-dot" />

          <div className="timeline-content">
            <div className="timeline-header">
              <span className="time">{item.year}</span>
            </div>

            <RichContent
              content={item.content}
              className="text-content timeline-box"
              block
            />

            {item.link && (
              <div className="timeline-link-wrapper">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-link"
                >
                  {item.linkText ?? ui?.details ?? "Details"}
                  <Icon
                    icon="arrow-up-right-from-square"
                    className="text-[10px]"
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
