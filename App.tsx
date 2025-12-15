
import React, { useState, useEffect } from 'react';
import PortfolioHeader from './components/PortfolioHeader';
import SectionWrapper from './components/SectionWrapper';
import Experience from './components/Experience';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import Banner from './components/Banner';
import Navbar from './components/Navbar';
import MarkdownText from './components/MarkdownText';
import { Config, ContentBlock } from './types';
import { configs } from './config';

const App: React.FC = () => {
  const [locale, setLocale] = useState<'en' | 'zh'>('en');
  const [config, setConfig] = useState<Config>(configs[locale]);

  useEffect(() => {
    setConfig(configs[locale]);
  }, [locale]);

  const i18n = {
    en: {
      affiliation: "Affiliation",
      contact: "Contact",
      interests: "Interests",
      thesis: "Thesis",
      viewPdf: "View PDF"
    },
    zh: {
      affiliation: "所属机构",
      contact: "联系方式",
      interests: "个人爱好",
      thesis: "学位论文",
      viewPdf: "查看 PDF"
    }
  }[locale];

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'profile':
        return (
          <div className="glass p-10 rounded-[3rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2 bg-blue-50 w-fit px-3 py-1 rounded-lg">
                  <i className="fa-solid fa-building-columns"></i> {i18n.affiliation}
                </h4>
                <p className="text-slate-800 font-black text-2xl leading-tight">
                   <MarkdownText content={block.data.affiliation} />
                </p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-5 flex items-center gap-2 bg-blue-50 w-fit px-3 py-1 rounded-lg">
                  <i className="fa-solid fa-paper-plane"></i> {i18n.contact}
                </h4>
                <ul className="grid grid-cols-1 gap-5">
                  {block.data.contact.map((c: any, i: number) => (
                    <li key={i} className="flex items-center gap-4 group">
                      <div className="w-14 h-14 rounded-3xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <i className={`fa-solid ${c.label.toLowerCase().includes('riken') ? 'fa-at' : c.label.toLowerCase().includes('utokyo') || c.label.toLowerCase().includes('东京大学') ? 'fa-university' : 'fa-envelope'} text-lg`}></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-0.5">{c.label}</span>
                        <a href={`mailto:${c.value}`} className="text-slate-800 hover:text-blue-600 font-bold text-lg transition-colors border-b-2 border-transparent hover:border-blue-100">
                          {c.value}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2 bg-blue-50 w-fit px-3 py-1 rounded-lg">
                <i className="fa-solid fa-heart"></i> {i18n.interests}
              </h4>
              <div className="flex flex-wrap gap-4">
                {block.data.interests.map((interest: string, i: number) => (
                  <span key={i} className="px-6 py-3 bg-white border border-slate-100 rounded-3xl text-slate-700 font-black shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all cursor-default text-sm">
                    {interest}
                  </span>
                ))}
              </div>
              <div className="mt-12 p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-[2.5rem] border border-blue-100/50 relative overflow-hidden">
                <i className="fa-solid fa-quote-left absolute -top-4 -left-4 text-9xl text-blue-500/5 select-none"></i>
                <p className="text-sm text-blue-800 font-black leading-relaxed relative z-10 italic">
                  "Theoretical physics is the pursuit of understanding the fundamental structure of reality through logic and beauty."
                </p>
              </div>
            </div>
          </div>
        );
      case 'experience':
        return <Experience items={block.data} />;
      case 'banner':
        return <Banner 
          title={block.title} 
          subtitle={block.subtitle || ''} 
          content={block.data.content} 
          deadline={block.data.deadline}
          actions={block.data.actions} 
        />;
      case 'timeline':
        return <Timeline items={block.data} />;
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {block.data.map((card: any, idx: number) => (
              <a 
                key={idx} 
                href={card.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative glass p-10 rounded-[3rem] border border-slate-100 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-24 -mt-24 group-hover:bg-blue-600/10 transition-colors duration-700"></div>
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">{i18n.thesis}</h4>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-700 transition-colors">
                    <MarkdownText content={card.title} />
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-10 font-medium">
                    <MarkdownText content={card.subtitle} />
                  </p>
                  <span className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors">
                    {i18n.viewPdf} <i className="fa-solid fa-file-pdf text-xl"></i>
                  </span>
                </div>
              </a>
            ))}
          </div>
        );
      case 'list':
        const ListTag = block.config?.listType === 'ol' ? 'ol' : 'ul';
        const listStyle = block.config?.listStyle || 'check';
        
        return (
          <ListTag className={`space-y-6 ${block.config?.listType === 'ol' ? 'list-decimal list-inside marker:text-blue-400 marker:font-black' : 'list-none'}`}>
            {block.data.map((item: any, i: number) => (
              <li key={i} className={`text-slate-700 leading-relaxed ${block.config?.listType !== 'ol' ? 'flex items-start gap-4' : 'pl-2'}`}>
                {block.config?.listType !== 'ol' && listStyle !== 'none' && (
                  <div className={`mt-1.5 w-6 h-6 flex-shrink-0 flex items-center justify-center transition-all ${
                    listStyle === 'circle' ? 'rounded-full bg-blue-100 border-2 border-white shadow-sm' : 
                    listStyle === 'square' ? 'rounded-xl bg-blue-100 border-2 border-white shadow-sm' :
                    'bg-transparent'
                  }`}>
                    {listStyle === 'check' && <i className="fa-solid fa-circle-check text-blue-400 text-lg"></i>}
                    {(listStyle === 'circle' || listStyle === 'square') && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                  </div>
                )}
                <div className="inline flex-1 font-semibold">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 border-b border-transparent hover:border-blue-200 transition-all">
                      <MarkdownText content={item.text} />
                    </a>
                  ) : <MarkdownText content={item.text} />}
                </div>
              </li>
            ))}
          </ListTag>
        );
      case 'gallery':
        return <Gallery items={block.data} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900">
      {config.navbar && (
        <Navbar 
          links={config.navbar.links} 
          locale={locale} 
          onLocaleChange={setLocale} 
          brand={config.name} 
        />
      )}

      <PortfolioHeader config={config} />
      
      <main className="container mx-auto px-6 max-w-6xl mt-24">
        {config.contents.map((block) => (
          <SectionWrapper key={block.id} title={block.title} icon={block.icon} id={block.id}>
            {renderBlock(block)}
          </SectionWrapper>
        ))}
      </main>

      <footer className="mt-12 border-t border-slate-100 pt-6 pb-8 text-center">
        <div className="container mx-auto px-6 max-w-6xl">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 leading-loose opacity-60">
             <MarkdownText content={config.footer} />
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
