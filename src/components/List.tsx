import type { FC } from "react";

import { Icon } from "./Icon.js";
import { RichContent } from "./RichContent.js";

/**
 * List item for publications, awards, etc.
 *
 * 出版物、奖项等的列表项
 */
export interface ListItem {
  /**
   * Item text (Markdown supported)
   *
   * 列表项文本 (支持 Markdown)
   */
  text: string;
  /**
   * Optional link URL
   *
   * 可选链接地址
   */
  link?: string;
  /**
   * Optional icon name to replace the list marker for this item
   *
   * 可选图标名称，设置后替换该项的列表标记
   */
  icon?: string;
}

export interface ListProps {
  /**
   * List of items
   *
   * 列表项
   */
  items: (ListItem | string)[];

  /**
   * Style of list markers for lists
   *
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
      {items.map((item) => {
        const itemObj = typeof item === "object" ? item : { text: item };
        const itemIcon = typeof item === "object" && item.icon ? item.icon : "";
        const hasItemIcon = itemIcon !== "";
        const showMarker = !isOrderedList || hasItemIcon;

        return (
          <li
            key={itemObj.text}
            className={`text-content ${hasItemIcon || !isOrderedList ? "list-li-unordered" : "list-li-ordered"} ${hasItemIcon && isOrderedList ? "list-none" : ""}`.trim()}
          >
            {showMarker && (
              <div className="list-marker-container">
                {hasItemIcon ? (
                  <Icon icon={itemIcon} className="list-marker-icon" />
                ) : (
                  <>
                    {dot === "check" && <Icon icon="circle-check" className="list-marker-icon" />}
                    {dot === "circle" && <div className="list-marker-circle" />}
                    {dot === "square" && <div className="list-marker-square" />}
                    {dot === "diamond" && <div className="list-marker-diamond" />}
                  </>
                )}
              </div>
            )}
            <div className="list-content">
              {itemObj.link ? (
                <a
                  href={itemObj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-link"
                >
                  <RichContent content={itemObj.text} />
                </a>
              ) : (
                <RichContent content={itemObj.text} block />
              )}
            </div>
          </li>
        );
      })}
    </ListTag>
  );
};
