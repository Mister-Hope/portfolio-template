import type { FC } from "react";
import type { HeroConfig } from "../types/index.js";
import { isCJKLocale } from "../utils/index.js";
import { Icon } from "./Icon.js";
import { Typewriter } from "./Typewriter.js";

/**
 * Props for the PortfolioHeader component
 * PortfolioHeader 组件的属性
 */
interface Props {
  /**
   * Configuration object containing user details
   * 包含用户详细信息的配置对象
   */
  hero: HeroConfig;
  /**
   * Current locale
   * 当前语言
   */
  locale?: string;
}

/**
 * The main hero section of the portfolio, displaying the avatar, name, titles, and social links.
 *
 * 作品集的主要 Hero 区域，显示头像、姓名、头衔和社交链接。
 */
export const Hero: FC<Props> = ({ hero, locale }) => {
  const isCJK = isCJKLocale(locale);

  return (
    <header className="group hero-header">
      {/* Background with Overlay */}
      <div className="hero-bg-wrapper">
        <img
          src={hero.bgImage}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        {/* Avatar Section */}
        <div className="group hero-avatar-wrapper">
          <div className="hero-avatar-glow" />
          <img src={hero.avatar} alt={hero.name} className="hero-avatar-img" />
        </div>

        {/* Info Section */}
        <div className="hero-info">
          <div className="hero-text-wrapper">
            <h2 className={`hero-welcome ${isCJK ? "" : "tracking-[0.2em]"}`}>
              {hero.welcome}
            </h2>
            <h1 className={`hero-name ${isCJK ? "" : "tracking-tighter"}`}>
              {hero.name}
            </h1>
            <div className={`hero-titles ${isCJK ? "" : "tracking-tight"}`}>
              <Typewriter texts={hero.titles} />
            </div>
          </div>

          {hero.medias && (
            <div className="hero-social-links">
              {hero.medias.map((media, idx) => (
                <a
                  key={idx}
                  href={media.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hero-btn"
                  title={media.name}
                >
                  <Icon icon={media.icon} className="text-xl" />
                  <span className="hero-social-btn-text">{media.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="hero-scroll-indicator"
        onClick={() => {
          const firstSection = document.querySelector("main > section");

          if (firstSection) {
            firstSection.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }
        }}
      >
        <Icon icon="chevron-down" className="text-3xl text-white" />
      </div>
    </header>
  );
};
