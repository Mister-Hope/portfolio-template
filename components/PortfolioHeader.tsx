
import React from 'react';
import { Config } from '../types';
import Typewriter from './Typewriter';

interface Props {
  config: Config;
}

const PortfolioHeader: React.FC<Props> = ({ config }) => {
  return (
    <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${config.bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12 text-white">
        {/* Avatar Section */}
        <div className="w-48 h-48 md:w-80 md:h-80 relative group">
          <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl group-hover:bg-blue-500/50 transition-all duration-500"></div>
          <img 
            src={config.avatar} 
            alt={config.name}
            className="w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-black text-blue-300 tracking-widest uppercase">
              {config.welcome}
            </h2>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none">
              {config.name}
            </h1>
            <div className="text-2xl md:text-3xl font-medium text-blue-100/90 h-10">
              <Typewriter texts={config.titles} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            {config.medias.map((media, idx) => (
              <a
                key={idx}
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1"
                title={media.name}
              >
                <i className={`${media.icon} text-lg`}></i>
                <span className="hidden lg:inline text-sm font-medium">{media.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
        <i className="fa-solid fa-chevron-down text-2xl text-white"></i>
      </div>
    </header>
  );
};

export default PortfolioHeader;
