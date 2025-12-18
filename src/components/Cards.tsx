import type { FC } from "react";
import { isCJKLocale } from "../utils/index.js";
import { Icon } from "./Icon.js";
import { RichContent } from "./RichContent.js";

export interface CardAction {
  /**
   * Action button label (e.g., "View PDF")
   * 操作按钮标签 (例如 "查看 PDF")
   */
  text: string;
  /**
   * Link URL
   * 链接地址
   */
  link?: string;
  /**
   * Icon class for the action button
   * 操作按钮的图标类名
   */
  icon?: string;
}

/**
 * Card item for projects or highlights
 * 项目或亮点的卡片项
 */
export interface CardItem {
  /**
   * Card title
   * 卡片标题
   */
  title: string;

  /**
   * Optional logo URL or object with light/dark mode URLs
   * 可选的标志 URL 或包含亮色/暗色模式 URL 的对象
   */
  logo?: string | { light: string; dark: string };

  /**
   * Category label (e.g., "Thesis")
   * 类别标签 (例如 "学位论文")
   */
  category?: string;
  /**
   * Optional description
   * 可选描述
   */
  description?: string;

  actions?: CardAction[];
}

export interface CardsProps {
  /**
   * List of card items
   * 卡片项列表
   */
  items: CardItem[];
  /**
   * Current locale
   * 当前语言
   */
  locale?: string;
}

/**
 * Cards component
 *
 * Displays a grid of cards, typically for theses or projects.
 *
 * 卡片组件
 *
 * 显示卡片网格，通常用于学位论文或项目。
 */
export const Cards: FC<CardsProps> = ({ items, locale }) => {
  const isCJK = isCJKLocale(locale);

  return (
    <div className="card-grid">
      {items.map((card, idx) => (
        <div key={idx} className="card-base card-item">
          <div className="card-decoration" />
          <div className="relative z-10">
            {card.category && (
              <h4 className={`label-sm mb-3 ${isCJK ? "" : "tracking-widest"}`}>
                {card.category}
              </h4>
            )}
            {card.logo &&
              (typeof card.logo === "string" ? (
                <img
                  src={card.logo}
                  alt={card.title}
                  className="card-logo float-right ml-4 mb-2"
                  loading="lazy"
                />
              ) : (
                <picture className="card-logo float-right ml-4 mb-2">
                  <source
                    media="(prefers-color-scheme: dark)"
                    srcSet={card.logo.dark}
                  />
                  <img src={card.logo.light} alt={card.title} loading="lazy" />
                </picture>
              ))}
            <h3 className="card-title">
              <RichContent content={card.title} />
            </h3>
            {card.description && (
              <RichContent
                className="card-description"
                content={card.description}
                block
              />
            )}
            {card.actions?.map((action, actionIndex) => {
              const content = (
                <>
                  <span>{action.text}</span>
                  {action.icon && (
                    <Icon icon={action.icon} className="text-lg inline-block" />
                  )}
                </>
              );

              return action.link ? (
                <a
                  key={actionIndex}
                  href={action.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-action mr-4"
                >
                  {content}
                </a>
              ) : (
                <span key={actionIndex} className="card-action mr-4">
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
