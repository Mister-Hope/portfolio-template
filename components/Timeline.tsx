
import React from 'react';
import { TimelineItem } from '../types';
import MarkdownText from './MarkdownText';

const Timeline: React.FC<{ items: TimelineItem[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="group relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 glass rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex-shrink-0 w-24">
            <span className="text-sm font-black text-blue-600/40 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
              {item.year}
            </span>
          </div>
          
          <div className="flex-1">
            <p className="text-slate-700 font-medium leading-relaxed">
              <MarkdownText content={item.content} />
            </p>
          </div>

          {item.link && (
            <div className="flex-shrink-0">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 group-hover:bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white shadow-sm transition-all active:scale-95"
              >
                {item.linkText || (item.link.includes('riken') ? 'Press' : 'Detail')}
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
