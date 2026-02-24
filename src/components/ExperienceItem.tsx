import type { FC } from "react";
import { Icon } from "./Icon.js";
import { RichContent } from "./RichContent.js";
import type { ExperienceTypeConfig } from "../utils/index.js";

/**
 * Experience item (work or study)
 * 经历项 (工作或学习)
 */
export interface ExperienceItem {
  /**
   * Type of experience
   * 经历类型
   */
  type: string;
  /**
   * Place/Institution name
   * 地点/机构名称
   */
  place: string;
  /**
   * Job title or Degree
   * 职位或学位
   */
  title?: string;
  /**
   * Time period (e.g., "2020 - 2024")
   * 时间段 (例如 "2020 - 2024")
   */
  time: string;
  /**
   * Main content/description (Markdown supported)
   * 主要内容/描述 (支持 Markdown)
   */
  content?: string;
  /**
   * Additional detailed description (Markdown supported)
   * 额外详细描述 (支持 Markdown)
   */
  description?: string;
  /**
   * Optional custom icon
   * 可选自定义图标
   */
  icon?: string;
}

interface ExperienceItemProps {
  item: ExperienceItem;
  index: number;
  itemsCount: number;
  config: ExperienceTypeConfig;
}

export const ExperienceItem: FC<ExperienceItemProps> = ({ item, index, itemsCount, config }) => {
  const { place, time, description, icon, title, content } = item;
  const { bgClass, icon: typeIcon, iconClass } = config;

  return (
    <div className="group experience-item">
      {/* Individual Timeline Line segment */}
      {index !== itemsCount - 1 && <div className="experience-line" />}

      {/* Timeline Node */}
      <div className={`experience-node ${bgClass}`} />

      <div className="flex flex-col gap-2 md:gap-3">
        {/* Top Meta: Time & Location */}
        <div className="experience-meta">
          <span className="time">{time}</span>
          <div className="experience-location">
            <Icon icon="location-dot" className="flex-shrink-0" />
            <span className="block min-w-0 text-left leading-tight">{place}</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="experience-card card-base">
          <div className="flex items-start gap-3 md:gap-4">
            <div className={`experience-icon-box ${iconClass}`}>
              <Icon icon={icon ?? typeIcon} className="text-title" />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <h3 className="experience-title">
                <RichContent content={title ?? ""} />
              </h3>
              {content && <RichContent className="text-content" content={content} block />}
              {description && (
                <RichContent content={description} className="experience-description" block />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
