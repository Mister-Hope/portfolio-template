
import React from 'react';
import { ExperienceItem } from '../types';
import MarkdownText from './MarkdownText';

const Experience: React.FC<{ items: ExperienceItem[] }> = ({ items }) => {
  return (
    <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-slate-200 ml-4 md:ml-0">
      {items.map((item, idx) => (
        <div key={idx} className="relative pl-10 group">
          {/* Timeline Node */}
          <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-125 ${item.type === 'study' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
          </div>

          <div className="flex flex-col gap-3">
            {/* Top Meta: Time & Location */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                {item.time}
              </span>
              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500 shadow-sm group-hover:text-blue-600 transition-all">
                <i className="fa-solid fa-location-dot"></i>
                {item.place}
              </div>
            </div>

            {/* Content Box */}
            <div className="glass p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-blue-500/5 transition-all duration-500">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${item.type === 'study' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <i className={`fa-solid ${item.icon || (item.type === 'study' ? 'fa-graduation-cap' : 'fa-briefcase')} text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    <MarkdownText content={item.title || ''} />
                  </h3>
                  {item.content && (
                    <div className="mt-1">
                      <p className="text-slate-600 font-medium text-sm">
                        <MarkdownText content={item.content} />
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {item.description && (
                <div className="pt-4 border-t border-slate-50">
                  <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                    <MarkdownText content={item.description} />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Experience;
