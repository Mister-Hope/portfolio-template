import type { FC } from "react";
import { useState, useEffect } from "react";
import { PortfolioHeader } from "./components/PortfolioHeader.jsx";
import { SectionWrapper } from "./components/SectionWrapper.jsx";
import { Experience } from "./components/Experience.jsx";
import { Timeline } from "./components/Timeline";
import { Gallery } from "./components/Gallery.jsx";
import { Banner } from "./components/Banner.jsx";
import Navbar from "./components/Navbar";
import MarkdownText from "./components/MarkdownText";
import { Icon } from "./components/Icon.js";
import type { Config, ContentBlock } from "./types.js";

import { configs } from "../config/index.js";

const App: FC = () => {
  const [locale, setLocale] = useState<"en" | "zh">("en");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");

      if (saved) return saved as "light" | "dark";

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return "light";
  });
  const [config, setConfig] = useState<Config>(configs[locale]);

  useEffect(() => {
    setConfig(configs[locale]);
  }, [locale]);

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (): void =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const i18n = {
    en: {
      affiliation: "Affiliation",
      contact: "Contact",
      interests: "Interests",
      thesis: "Thesis",
      viewPdf: "View PDF",
    },
    zh: {
      affiliation: "所属机构",
      contact: "联系方式",
      interests: "个人爱好",
      thesis: "学位论文",
      viewPdf: "查看 PDF",
    },
  }[locale];

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "profile":
        return (
          <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 w-fit px-3 py-1.5 rounded-lg">
                  <Icon icon="fa-solid fa-building-columns" />{" "}
                  {i18n.affiliation}
                </h4>
                <p className="text-slate-800 dark:text-slate-100 font-black text-2xl md:text-3xl leading-tight">
                  <MarkdownText content={block.data.affiliation} />
                </p>
              </div>
              <div>
                <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 w-fit px-3 py-1.5 rounded-lg">
                  <Icon icon="fa-solid fa-paper-plane" /> {i18n.contact}
                </h4>
                <ul className="grid grid-cols-1 gap-5">
                  {block.data.contact.map((c: any, i: number) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 transition-all duration-500">
                        <Icon
                          icon={`fa-solid ${c.label.toLowerCase().includes("riken") ? "fa-at" : c.label.toLowerCase().includes("utokyo") || c.label.toLowerCase().includes("东京大学") ? "fa-university" : "fa-envelope"}`}
                          className="text-base"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-0.5">
                          {c.label}
                        </span>
                        <a
                          href={`mailto:${c.value}`}
                          className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-lg transition-colors border-b border-transparent hover:border-blue-100 dark:hover:border-blue-900 w-fit"
                        >
                          {c.value}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-5 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 w-fit px-3 py-1.5 rounded-lg">
                <i className="fa-solid fa-heart" /> {i18n.interests}
              </h4>
              <div className="flex flex-wrap gap-3">
                {block.data.interests.map((interest: string, i: number) => (
                  <span
                    key={i}
                    className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-700 dark:text-slate-300 font-black shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all cursor-default text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
              {block.data.quote && (
                <div className="mt-10 p-7 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-[2rem] border border-blue-100/50 dark:border-blue-400/10 relative overflow-hidden">
                  <i className="fa-solid fa-quote-left absolute -top-1 -left-1 text-5xl text-blue-500/5 select-none" />
                  <p className="text-base text-blue-800 dark:text-blue-300 font-black leading-relaxed relative z-10 italic">
                    "<MarkdownText content={block.data.quote} />"
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "experience":
        return <Experience items={block.data} />;
      case "banner":
        return (
          <Banner
            title={block.title}
            subtitle={block.subtitle ?? ""}
            content={block.data.content}
            deadline={block.data.deadline}
            actions={block.data.actions}
          />
        );
      case "timeline":
        return <Timeline items={block.data} />;
      case "cards":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {block.data.map((card: any, idx: number) => (
              <a
                key={idx}
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative glass p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/10 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors duration-700" />
                <div className="relative z-10">
                  <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
                    {i18n.thesis}
                  </h4>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-3 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    <MarkdownText content={card.title} />
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-bold text-base">
                    <MarkdownText content={card.subtitle} />
                  </p>
                  <span className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {i18n.viewPdf}{" "}
                    <i className="fa-solid fa-file-pdf text-lg" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        );
      case "list":
        const ListTag = block.config?.listType === "ol" ? "ol" : "ul";
        const listStyle = block.config?.listStyle ?? "check";

        return (
          <ListTag
            className={`space-y-4 ${block.config?.listType === "ol" ? "list-decimal list-inside marker:text-blue-400 dark:marker:text-blue-500 marker:font-black text-lg" : "list-none text-lg"}`}
          >
            {block.data.map((item: any, i: number) => (
              <li
                key={i}
                className={`text-slate-700 dark:text-slate-300 leading-relaxed ${block.config?.listType !== "ol" ? "flex items-start gap-4" : "pl-2"}`}
              >
                {block.config?.listType !== "ol" && listStyle !== "none" && (
                  <div
                    className={`mt-1.5 w-6 h-6 flex-shrink-0 flex items-center justify-center transition-all ${
                      listStyle === "circle"
                        ? "rounded-full bg-blue-100 dark:bg-blue-900/50 border-2 border-white dark:border-slate-800 shadow-sm"
                        : listStyle === "square"
                          ? "rounded-xl bg-blue-100 dark:bg-blue-900/50 border-2 border-white dark:border-slate-800 shadow-sm"
                          : "bg-transparent"
                    }`}
                  >
                    {listStyle === "check" && (
                      <i className="fa-solid fa-circle-check text-blue-400 dark:text-blue-500 text-lg" />
                    )}
                    {(listStyle === "circle" || listStyle === "square") && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                )}
                <div className="inline flex-1 font-semibold">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400 border-b border-transparent hover:border-blue-200 transition-all"
                    >
                      <MarkdownText content={item.text} />
                    </a>
                  ) : (
                    <MarkdownText content={item.text} />
                  )}
                </div>
              </li>
            ))}
          </ListTag>
        );
      case "gallery":
        return <Gallery items={block.data} />;
      case "paragraph":
        return (
          <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/10 text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
            <MarkdownText content={block.data} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100">
      {config.navbar && (
        <Navbar
          links={config.navbar.links}
          locale={locale}
          onLocaleChange={setLocale}
          theme={theme}
          onThemeChange={toggleTheme}
          brand={config.name}
        />
      )}

      <PortfolioHeader config={config} />

      <main className="container mx-auto px-6 max-w-7xl mt-12 md:mt-16">
        {config.contents.map((block) => (
          <SectionWrapper
            key={block.id}
            title={block.title}
            icon={block.icon}
            id={block.id}
          >
            {renderBlock(block)}
          </SectionWrapper>
        ))}
      </main>

      <footer className="mt-8 border-t border-slate-100 dark:border-white/5 pt-10 pb-12 text-center">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-semibold mb-2">
            <MarkdownText content={config.footer.copyright} />
          </div>
          {config.footer.description && (
            <div className="text-slate-400 dark:text-slate-500 text-xs md:text-sm tracking-wider font-medium opacity-80">
              <MarkdownText content={config.footer.description} />
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
