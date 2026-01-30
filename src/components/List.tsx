import type { FC } from "react";
import { Icon } from "./Icon.js";
import { RichContent } from "./RichContent.js";

/**
 * List item for publications, awards, etc.
 * 出版物、奖项等的列表项
 */
export interface ListItem {
  /**
   * Item text (Markdown supported)
   * 列表项文本 (支持 Markdown)
   */
  text: string;
  /**
   * Optional link URL
   * 可选链接地址
   */
  link?: string;
}

export interface ListProps {
  /**
   * List of items
   * 列表项
   */
  items: (ListItem | string)[];

  /**
   * Style of list markers for lists
   * 无序列表的列表标记样式
   */
  dot?: "circle" | "square" | "diamond" | "check" | "none" | "number";
}

/**
 * List component
 *
 * Displays a list of items with configurable styling.
 *
 * 列表组件
 *
 * 显示带有可配置样式的项目列表。
 */
export const List: FC<ListProps> = ({ items, dot = "number" }) => {
  const isOrderedList = dot === "number";
  const ListTag = isOrderedList ? "ol" : "ul";

  return (
    <ListTag className={isOrderedList ? "list-ol" : "list-ul"}>
      {items.map((item) => (
        <li
          key={typeof item === "object" ? item.text : item}
          className={`text-content ${isOrderedList ? "list-li-ordered" : "list-li-unordered"}`}
        >
          {!isOrderedList && (
            <div className="list-marker-container">
              {dot === "check" && <Icon icon="circle-check" className="list-marker-check" />}
              {dot === "circle" && <div className="list-marker-circle" />}
              {dot === "square" && <div className="list-marker-square" />}
              {dot === "diamond" && <div className="list-marker-diamond" />}
            </div>
          )}
          <div className="list-content">
            {typeof item === "object" && item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="list-link">
                <RichContent content={item.text} />
              </a>
            ) : (
              <RichContent content={typeof item === "object" ? item.text : item} block />
            )}
          </div>
        </li>
      ))}
    </ListTag>
  );
};
