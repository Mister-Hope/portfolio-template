import type { FC } from "react";
import type { AdaptiveImageSource } from "../types/index.js";
import { isCJKLocale } from "../utils/index.js";
import { AdaptiveImage } from "./AdaptiveImage.js";
import { Icon } from "./Icon.js";
import { RichContent } from "./RichContent.js";

export interface CardAction {
  /**
   * Action button label (e.g., "View PDF")
   * 操作按钮标签 (例如 "查看 PDF")
   */
  text?: string;
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
  logo?: AdaptiveImageSource;

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
        <div key={idx} className="card-item flex flex-col card-base">
          <div className="card-decoration" />
          <div className="relative z-10 block">
            {card.category && (
              <h4 className={`mb-3 label-sm ${isCJK ? "" : "tracking-widest"}`}>{card.category}</h4>
            )}
            {card.logo && (
              <AdaptiveImage
                src={card.logo}
                alt={card.title}
                className="card-logo float-right mb-2 ml-4"
                loading="lazy"
              />
            )}
            <h3 className="card-title">
              <RichContent content={card.title} />
            </h3>
            {card.description && (
              <RichContent className="card-description" content={card.description} block />
            )}
          </div>
          {card.actions && (
            <div className="relative z-10 mt-auto flex flex-wrap items-center">
              {card.actions.map(({ text, icon, link }, actionIndex) => {
                if (!text && !icon) return null;

                const className = `card-action ${text ? "mx-1" : "mx-0.5"}`;
                const content = (
                  <>
                    {text && <span>{text}</span>}
                    {icon && <Icon icon={icon} className="inline-block text-lg" />}
                  </>
                );

                return link ? (
                  <a
                    key={actionIndex}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${className} card-action-link`}
                  >
                    {content}
                  </a>
                ) : (
                  <span key={actionIndex} className={className}>
                    {content}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
