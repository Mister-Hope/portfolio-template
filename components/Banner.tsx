
import React from 'react';

interface Action {
  label: string;
  link: string;
  primary?: boolean;
}

interface BannerProps {
  title: string;
  subtitle: string;
  content: string;
  deadline?: string;
  actions: Action[];
}

const Banner: React.FC<BannerProps> = ({ title, subtitle, content, deadline, actions }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-blue-200">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl -ml-20 -mb-20"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider">
            Now Recruiting / CFP
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {subtitle}
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
              {content}
            </p>
          </div>
          {deadline && (
            <div className="flex items-center gap-3 text-sm font-semibold text-blue-200">
              <i className="fa-solid fa-clock"></i>
              Deadline: {deadline}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {actions.map((action, idx) => (
            <a
              key={idx}
              href={action.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-8 py-4 rounded-2xl font-bold text-center transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${
                action.primary 
                  ? 'bg-white text-blue-700 shadow-xl shadow-blue-900/20' 
                  : 'bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10'
              }`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
