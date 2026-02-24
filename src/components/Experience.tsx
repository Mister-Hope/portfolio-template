import type { FC } from "react";
import type { ExperienceTypesConfig } from "../utils/index.js";
import { defaultExperienceTypes } from "../utils/index.js";
import { ExperienceItem } from "./ExperienceItem.js";

export interface ExperienceProps {
  /**
   * List of experience items to display
   * 要显示的经历项列表
   */
  items: ExperienceItem[];
  /**
   * Custom styles for experience types
   * 经历类型的自定义样式
   */
  types?: ExperienceTypesConfig;
  /**
   * Current locale
   * 当前语言
   */
  locale?: string;
}

/**
 * Experience component
 *
 * Displays a vertical timeline of work and study experiences.
 *
 * 经历组件
 *
 * 显示工作和学习经历的垂直时间轴。
 */
export const Experience: FC<ExperienceProps> = ({ items, types = {} }) => {
  const mergedTypes = { ...defaultExperienceTypes, ...types };

  return (
    <div className="experience-list">
      {items.map((item, index) => (
        <ExperienceItem
          key={`${item.title}${item.description ?? ""}${item.time}${item.place}`}
          item={item}
          index={index}
          itemsCount={items.length}
          config={mergedTypes[item.type] || mergedTypes.work}
        />
      ))}
    </div>
  );
};
