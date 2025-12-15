import type { FC } from "react";
import type { Config } from "../types.js";
import { Icon } from "./Icon.js";
import { Typewriter } from "./Typewriter.jsx";

/**
 * Props for the PortfolioHeader component
 * PortfolioHeader 组件的属性
 */
interface Props {
  /**
   * Configuration object containing user details
   * 包含用户详细信息的配置对象
   */
  config: Config;
}

/**
 * PortfolioHeader component
 *
 * The main hero section of the portfolio, displaying the avatar, name, titles, and social links.
 *
 * 作品集头部组件
 *
 * 作品集的主要 Hero 区域，显示头像、姓名、头衔和社交链接。
 */
export const PortfolioHeader: FC<Props> = ({ config }) => {
  return (
    <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${config.bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 text-white">
        {/* Avatar Section */}
        <div className="w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 relative group flex-shrink-0">
          <div className="absolute inset-0 bg-blue-500/40 rounded-full blur-3xl group-hover:bg-blue-500/60 transition-all duration-500" />
          <img
            src={config.avatar}
            alt={config.name}
            className="w-full h-full object-cover rounded-full border-8 border-white/20 shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-[1.02]"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-3xl">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-blue-300 tracking-[0.2em] uppercase drop-shadow-lg">
              {config.welcome}
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none drop-shadow-2xl">
              {config.name}
            </h1>
            <div className="text-xl md:text-3xl lg:text-4xl font-black text-blue-100/95 h-12 md:h-16 tracking-tight">
              <Typewriter texts={config.titles} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-8">
            {config.medias.map((media, idx) => (
              <a
                key={idx}
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-white/10 hover:bg-white/25 px-6 py-3 rounded-full border border-white/20 backdrop-blur-xl transition-all duration-500 transform hover:-translate-y-2 shadow-lg"
                title={media.name}
              >
                <Icon icon={media.icon} className="text-xl" />
                <span className="hidden sm:inline text-base font-black tracking-wide">
                  {media.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-80 cursor-pointer">
        <Icon icon="fa-solid fa-chevron-down" className="text-3xl text-white" />
      </div>
    </header>
  );
};

export default PortfolioHeader;
