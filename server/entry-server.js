import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { useState, useEffect } from "react";
import { Icon as Icon$1 } from "@iconify/react";
const isCJKLocale = (locale) => {
  if (!locale) return false;
  return ["zh", "ja", "ko"].includes(locale);
};
const resolveIcon = (icon) => {
  if (icon.includes(":")) {
    return icon;
  }
  const cleanName = icon.replace(/^fa-/, "");
  return `fa6-solid:${cleanName}`;
};
const Icon = ({ icon, className, style, ...props }) => {
  if (icon.startsWith("/") || icon.startsWith("http")) {
    const isExternal = icon.startsWith("http");
    const src = isExternal ? icon : `${"/".replace(/\/$/, "") || ""}${icon}`;
    return /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt: "",
        className: `inline-block object-contain align-middle w-[1em] h-[1em] ${className ?? ""}`,
        style,
        ...props
      }
    );
  }
  return /* @__PURE__ */ jsx(
    Icon$1,
    {
      icon: resolveIcon(icon),
      className,
      style,
      ...props
    }
  );
};
const Typewriter = ({
  texts,
  speed = 100,
  pause = 2e3
}) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), pause);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, speed);
    return () => {
      clearTimeout(timeout);
    };
  }, [subIndex, index, reverse, texts, speed, pause]);
  return /* @__PURE__ */ jsx("span", { className: "typewriter-cursor", children: texts[index].substring(0, subIndex) });
};
const PortfolioHeader = ({ hero, locale }) => {
  const isCJK = isCJKLocale(locale);
  return /* @__PURE__ */ jsxs("header", { className: "relative w-full h-screen flex items-center justify-center overflow-hidden group", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105",
        style: { backgroundImage: `url(${hero.bgImage})` },
        children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-[1px]" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 text-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-56 h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 relative group flex-shrink-0", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-primary-500/40 rounded-full blur-3xl group-hover:bg-primary-500/60 transition-all duration-500" }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: hero.avatar,
            alt: hero.name,
            className: "w-full h-full object-cover rounded-full border-8 border-white/20 shadow-2xl relative z-10 transition-all duration-700 hover:scale-[1.02]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center lg:text-left space-y-8 max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              className: `text-xl md:text-2xl lg:text-3xl font-black text-primary-300 uppercase drop-shadow-lg ${isCJK ? "" : "tracking-[0.2em]"}`,
              children: hero.welcome
            }
          ),
          /* @__PURE__ */ jsx(
            "h1",
            {
              className: `text-5xl md:text-7xl lg:text-8xl font-black leading-none drop-shadow-2xl ${isCJK ? "" : "tracking-tighter"}`,
              children: hero.name
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `text-xl md:text-3xl lg:text-4xl font-black text-primary-100/95 h-12 md:h-16 ${isCJK ? "" : "tracking-tight"}`,
              children: /* @__PURE__ */ jsx(Typewriter, { texts: hero.titles })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center lg:justify-start gap-5 pt-8", children: hero.medias.map((media, idx) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: media.link,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "group flex items-center gap-3 bg-white/10 hover:bg-white/25 px-6 py-3 rounded-full border border-white/20 backdrop-blur-xl transition-all duration-500 transform hover:-translate-y-1 shadow-lg",
            title: media.name,
            children: [
              /* @__PURE__ */ jsx(Icon, { icon: media.icon, className: "text-xl" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline text-base font-black tracking-wide", children: media.name })
            ]
          },
          idx
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-80 cursor-pointer",
        onClick: () => {
          const firstSection = document.querySelector("main > section");
          if (firstSection) {
            firstSection.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth"
            });
          }
        },
        children: /* @__PURE__ */ jsx(Icon, { icon: "chevron-down", className: "text-3xl text-white" })
      }
    )
  ] });
};
const SectionWrapper = ({
  title,
  icon,
  children,
  id,
  locale
}) => {
  const isCJK = isCJKLocale(locale);
  return /* @__PURE__ */ jsx(
    "section",
    {
      id,
      className: "py-10 md:py-16 first:pt-8 scroll-mt-24 md:scroll-mt-32 border-t border-slate-100 dark:border-white/5 first:border-t-0",
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-10 md:gap-14", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 md:gap-6", children: [
          icon && /* @__PURE__ */ jsx(
            Icon,
            {
              icon,
              className: "text-3xl md:text-4xl lg:text-5xl text-primary-600 dark:text-primary-400 flex-shrink-0"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(
              "h2",
              {
                className: `text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 leading-none ${isCJK ? "" : "tracking-tighter"}`,
                children: title
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "h-1.5 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full", children })
      ] })
    }
  );
};
const RichContent = ({
  content,
  className = ""
}) => {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `rich-content ${className}`,
      dangerouslySetInnerHTML: { __html: content }
    }
  );
};
const defaultStyles = {
  work: {
    background: "bg-emerald-600",
    icon: "briefcase",
    iconBox: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
  },
  study: {
    background: "bg-indigo-600",
    icon: "graduation-cap",
    iconBox: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
  },
  volunteer: {
    background: "bg-amber-500",
    icon: "handshake-angle",
    iconBox: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
  },
  vacation: {
    background: "bg-sky-500",
    icon: "umbrella-beach",
    iconBox: "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400"
  },
  project: {
    background: "bg-purple-600",
    icon: "laptop-code",
    iconBox: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
  }
};
const Experience = ({
  items,
  styles = {},
  locale
}) => {
  const mergedStyles = { ...defaultStyles, ...styles };
  const isCJK = isCJKLocale(locale);
  const getStyle = (type) => (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    mergedStyles[type] || mergedStyles.work
  );
  return /* @__PURE__ */ jsx("div", { className: "space-y-10 pl-0 md:pl-4", children: items.map((item, idx) => {
    const style = getStyle(item.type);
    return /* @__PURE__ */ jsxs("div", { className: "relative pl-10 md:pl-12 group", children: [
      idx !== items.length - 1 && /* @__PURE__ */ jsx("div", { className: "absolute left-[7.5px] md:left-[9.5px] top-5 bottom-[-2.5rem] w-px bg-slate-200 dark:bg-slate-800 z-0" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute left-0 top-1 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white dark:border-slate-950 shadow-sm flex items-center justify-center z-10 transition-all duration-500 group-hover:scale-110 ${style.background}`
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 px-1", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `text-[10px] md:text-xs font-black text-primary-600 dark:text-primary-400 uppercase bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg ${isCJK ? "" : "tracking-widest"}`,
              children: item.time
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase text-slate-400 dark:text-slate-500 shadow-sm transition-all max-w-[70vw] md:max-w-xs min-w-0 ${isCJK ? "" : "tracking-wider"}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { icon: "location-dot" }) }),
                /* @__PURE__ */ jsx("span", { className: "truncate block min-w-0", children: item.place })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "glass p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm group-hover:shadow-2xl group-hover:shadow-primary-500/5 transition-all duration-700", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 md:gap-6", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${style.iconBox}`,
              children: /* @__PURE__ */ jsx(
                Icon,
                {
                  icon: item.icon ?? style.icon,
                  className: "text-lg md:text-2xl"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-2xl font-black text-slate-900 dark:text-slate-100 leading-tight transition-colors break-words", children: /* @__PURE__ */ jsx(RichContent, { content: item.title ?? "" }) }),
            item.content && /* @__PURE__ */ jsx("div", { className: "text-slate-600 dark:text-slate-300 font-bold text-sm md:text-lg leading-snug", children: /* @__PURE__ */ jsx(RichContent, { content: item.content }) }),
            item.description && /* @__PURE__ */ jsx("div", { className: "pt-1 md:pt-2", children: /* @__PURE__ */ jsx("p", { className: "text-slate-400 dark:text-slate-500 text-xs md:text-base font-medium leading-relaxed italic", children: /* @__PURE__ */ jsx(RichContent, { content: item.description }) }) })
          ] })
        ] }) })
      ] })
    ] }, idx);
  }) });
};
const Timeline = ({ items }) => {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: items.map((item, idx) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 glass rounded-3xl border border-slate-100 dark:border-white/10 hover:border-primary-200 dark:hover:border-primary-900/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300",
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-24", children: /* @__PURE__ */ jsx("span", { className: "text-base font-black text-primary-600/80 dark:text-primary-400/80 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-widest", children: item.year }) }),
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("p", { className: "text-slate-700 dark:text-slate-300 font-bold text-lg leading-relaxed", children: /* @__PURE__ */ jsx(RichContent, { content: item.content }) }) }),
        item.link && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: item.link,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-primary-600 dark:group-hover:bg-primary-600 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-white dark:group-hover:text-white shadow-sm transition-all active:scale-95",
            children: [
              item.linkText ?? "Detail",
              /* @__PURE__ */ jsx(
                Icon,
                {
                  icon: "arrow-up-right-from-square",
                  className: "text-[10px]"
                }
              )
            ]
          }
        ) })
      ]
    },
    idx
  )) });
};
const Gallery = ({ items }) => {
  const [selected, setSelected] = useState(null);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6", children: items.map((item, idx) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "break-inside-avoid relative group cursor-zoom-in rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500",
        onClick: () => setSelected(item),
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: item.url,
              alt: item.title,
              className: "w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 dark:from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-white font-bold text-lg", children: item.title }),
            (item.location || item.date) && /* @__PURE__ */ jsxs("p", { className: "text-white/70 dark:text-white/60 text-sm flex items-center gap-2", children: [
              item.location && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Icon, { icon: "location-dot", className: "text-xs" }),
                item.location
              ] }),
              item.location && item.date && "•",
              item.date
            ] })
          ] })
        ]
      },
      idx
    )) }),
    selected && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[100] bg-black/95 dark:bg-slate-950/98 backdrop-blur-xl flex items-center justify-center p-6 sm:p-12 cursor-zoom-out",
        onClick: () => setSelected(null),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "max-w-5xl w-full relative group",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "absolute -top-12 right-0 text-white/50 hover:text-white transition-colors",
                  onClick: () => setSelected(null),
                  children: /* @__PURE__ */ jsx(Icon, { icon: "xmark", className: "text-3xl" })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "bg-white/5 p-2 rounded-2xl overflow-hidden shadow-2xl", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: selected.url,
                  alt: selected.title,
                  className: "w-full h-auto max-h-[70vh] object-contain rounded-xl"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-8 text-white space-y-4 max-w-3xl mx-auto text-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-3xl font-black tracking-tight", children: selected.title }),
                  (selected.location || selected.date) && /* @__PURE__ */ jsxs("p", { className: "text-primary-400 dark:text-primary-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2", children: [
                    selected.location && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Icon, { icon: "location-dot" }),
                      selected.location
                    ] }),
                    selected.location && selected.date && "•",
                    selected.date
                  ] })
                ] }),
                selected.description && /* @__PURE__ */ jsx("p", { className: "text-slate-300 dark:text-slate-400 text-lg leading-relaxed font-medium italic bg-white/5 p-6 rounded-3xl border border-white/10", children: selected.description })
              ] })
            ]
          }
        )
      }
    )
  ] });
};
const Banner = ({
  title,
  subtitle,
  content,
  footer,
  actions
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-gradient-to-br from-secondary-600 to-primary-800 dark:from-secondary-800 dark:to-primary-950 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-primary-200 dark:shadow-none", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full blur-2xl -ml-20 -mb-20" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col lg:flex-row items-center gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6", children: [
        title && /* @__PURE__ */ jsx("div", { className: "inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider", children: title }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          subtitle && /* @__PURE__ */ jsx("h3", { className: "text-3xl md:text-4xl font-bold tracking-tight leading-tight [&_a]:!text-white [&_a]:underline [&_a]:decoration-white/50 hover:[&_a]:decoration-white hover:[&_a]:!text-primary-100 transition-all", children: /* @__PURE__ */ jsx(RichContent, { content: subtitle }) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "text-primary-100 dark:text-primary-200 text-lg max-w-2xl leading-relaxed \n              [&_a]:!text-white [&_a]:font-black [&_a]:underline [&_a]:underline-offset-4 \n              [&_a]:decoration-primary-300/50 hover:[&_a]:decoration-white hover:[&_a]:!text-primary-100 transition-all",
              children: /* @__PURE__ */ jsx(RichContent, { content })
            }
          )
        ] }),
        footer && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 text-sm font-semibold text-primary-200 dark:text-primary-300", children: footer })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row gap-4 w-full lg:w-auto", children: actions.map((action, idx) => /* @__PURE__ */ jsx(
        "a",
        {
          href: action.link,
          target: "_blank",
          rel: "noopener noreferrer",
          className: `px-8 py-4 rounded-2xl font-bold text-center transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${action.primary ? "bg-white text-primary-700 shadow-xl shadow-primary-900/20 dark:shadow-none" : "bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10"}`,
          children: action.label
        },
        idx
      )) })
    ] })
  ] });
};
const Navbar = ({
  links,
  nextLocaleName,
  onLocaleChange,
  theme,
  onThemeChange,
  themeLabel = "Toggle Theme",
  brand,
  showLocaleSwitch = true
}) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "nav",
    {
      className: `fixed top-0 left-0 right-0 z-[100] border-b transition-all duration-500 ${scrolled ? "py-3 md:py-4 glass border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/10 dark:shadow-none" : "py-4 md:py-8 bg-transparent border-transparent shadow-none"}`,
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 max-w-7xl flex items-center justify-between", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            className: `text-xl md:text-2xl font-black tracking-tighter transition-all duration-300 ${scrolled ? "text-slate-900 dark:text-white" : "text-white drop-shadow-md"}`,
            children: brand
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 md:gap-10", children: [
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex items-center gap-8", children: links.map((link, idx) => /* @__PURE__ */ jsx(
            "a",
            {
              href: link.anchor,
              className: `text-xs md:text-sm font-black uppercase tracking-widest transition-all hover:text-primary-500 ${scrolled ? "text-slate-500 dark:text-slate-400" : "text-white/80"}`,
              children: link.label
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-l border-slate-200 dark:border-white/10 pl-3 md:pl-5", children: [
            showLocaleSwitch && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: onLocaleChange,
                className: `cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-black text-[10px] md:text-xs uppercase tracking-widest ${scrolled ? "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-600 hover:text-white" : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900"}`,
                children: [
                  /* @__PURE__ */ jsx(Icon, { icon: "language", className: "text-sm md:text-base" }),
                  nextLocaleName
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onThemeChange,
                className: `cursor-pointer flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full border transition-all ${scrolled ? "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary-600 hover:text-white" : "border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900"}`,
                title: themeLabel,
                children: /* @__PURE__ */ jsx(
                  Icon,
                  {
                    icon: theme === "light" ? "moon" : "sun",
                    className: "text-sm md:text-base"
                  }
                )
              }
            )
          ] })
        ] })
      ] })
    }
  );
};
const Profile = ({ data, ui }) => {
  return /* @__PURE__ */ jsxs("div", { className: "glass p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-8", children: data.fields.map((field, index) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3 flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 w-fit px-3 py-1.5 rounded-lg", children: [
        /* @__PURE__ */ jsx(Icon, { icon: field.icon }),
        " ",
        field.title
      ] }),
      Array.isArray(field.value) ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: field.value.map((item, i) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-slate-700 dark:text-slate-300 font-black shadow-sm hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all cursor-default text-sm",
          children: item
        },
        i
      )) }) : /* @__PURE__ */ jsx("p", { className: "text-slate-800 dark:text-slate-100 font-black text-2xl md:text-3xl leading-tight", children: /* @__PURE__ */ jsx(RichContent, { content: field.value }) })
    ] }, index)) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 w-fit px-3 py-1.5 rounded-lg", children: [
          /* @__PURE__ */ jsx(Icon, { icon: "paper-plane" }),
          " ",
          ui?.contact ?? "Contact"
        ] }),
        /* @__PURE__ */ jsx("ul", { className: "grid grid-cols-1 gap-5", children: data.contact.map((c, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 transition-all duration-500", children: /* @__PURE__ */ jsx(Icon, { icon: c.icon ?? "envelope", className: "text-base" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-0.5", children: c.label }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: c.link ?? `mailto:${c.value}`,
                className: "text-slate-800 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 font-bold text-lg transition-colors border-b border-transparent hover:border-primary-100 dark:hover:border-primary-900 w-fit",
                children: c.value
              }
            )
          ] })
        ] }, i)) })
      ] }),
      data.slogan && /* @__PURE__ */ jsxs("div", { className: "p-7 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-[2rem] border border-primary-100/50 dark:border-primary-400/10 relative overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          Icon,
          {
            icon: "quote-left",
            className: "absolute -top-1 -left-1 text-5xl text-primary-500/5 select-none"
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "text-base text-primary-800 dark:text-primary-300 font-black leading-relaxed relative z-10 italic", children: [
          '"',
          /* @__PURE__ */ jsx(RichContent, { content: data.slogan }),
          '"'
        ] })
      ] })
    ] })
  ] });
};
const Cards = ({ items, locale }) => {
  const isCJK = isCJKLocale(locale);
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: items.map((card, idx) => /* @__PURE__ */ jsxs(
    "a",
    {
      href: card.link,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "group relative glass p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/10 transition-all duration-700 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-1.5 overflow-hidden",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-36 h-36 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary-600/10 transition-colors duration-700" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsx(
            "h4",
            {
              className: `text-xs font-black text-primary-600 dark:text-primary-400 uppercase mb-4 ${isCJK ? "" : "tracking-widest"}`,
              children: card.category
            }
          ),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-slate-900 dark:text-slate-100 mb-3 leading-tight group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors", children: /* @__PURE__ */ jsx(RichContent, { content: card.title }) }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-bold text-base", children: /* @__PURE__ */ jsx(RichContent, { content: card.subtitle }) }),
          (card.action || card.icon) && /* @__PURE__ */ jsxs(
            "span",
            {
              className: `inline-flex items-center gap-3 text-xs font-black uppercase text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${isCJK ? "" : "tracking-[0.2em]"}`,
              children: [
                card.action,
                card.icon && /* @__PURE__ */ jsx(Icon, { icon: card.icon, className: "text-lg" })
              ]
            }
          )
        ] })
      ]
    },
    idx
  )) });
};
const List = ({ items, unordered, dot }) => {
  const ListTag = unordered ? "ul" : "ol";
  const listStyle = dot ?? "circle";
  return /* @__PURE__ */ jsx(
    ListTag,
    {
      className: `space-y-4 ${unordered ? "list-none text-lg" : "list-decimal list-inside marker:text-primary-400 dark:marker:text-primary-500 marker:font-black text-lg"}`,
      children: items.map((item, i) => /* @__PURE__ */ jsxs(
        "li",
        {
          className: `text-slate-700 dark:text-slate-300 leading-relaxed ${unordered ? "flex items-start gap-4" : "pl-2"}`,
          children: [
            unordered && listStyle !== "none" && /* @__PURE__ */ jsxs("div", { className: "mt-1 w-6 h-6 flex-shrink-0 flex items-center justify-center transition-all", children: [
              listStyle === "check" && /* @__PURE__ */ jsx(
                Icon,
                {
                  icon: "circle-check",
                  className: "text-primary-400 dark:text-primary-500 text-lg"
                }
              ),
              listStyle === "circle" && /* @__PURE__ */ jsx("div", { className: "w-3.5 h-3.5 rounded-full bg-primary-500 dark:bg-primary-400 shadow-sm" }),
              listStyle === "square" && /* @__PURE__ */ jsx("div", { className: "w-3.5 h-3.5 rounded-[1px] bg-primary-500 dark:bg-primary-400 shadow-sm" }),
              listStyle === "diamond" && /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rotate-45 bg-primary-500 dark:bg-primary-400 shadow-sm" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "inline flex-1 font-semibold", children: item.link ? /* @__PURE__ */ jsx(
              "a",
              {
                href: item.link,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "hover:text-primary-600 dark:hover:text-primary-400 border-b border-transparent hover:border-primary-200 transition-all",
                children: /* @__PURE__ */ jsx(RichContent, { content: item.text })
              }
            ) : /* @__PURE__ */ jsx(RichContent, { content: item.text }) })
          ]
        },
        i
      ))
    }
  );
};
const Paragraph = ({ content }) => {
  return /* @__PURE__ */ jsx("div", { className: "glass p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/10 text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-medium", children: /* @__PURE__ */ jsx(RichContent, { content }) });
};
const Footer = ({ copyright, description }) => {
  return /* @__PURE__ */ jsx("footer", { className: "mt-8 border-t border-slate-100 dark:border-white/5 pt-10 pb-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 max-w-7xl", children: [
    /* @__PURE__ */ jsx("div", { className: "text-slate-500 dark:text-slate-400 text-base md:text-lg font-semibold mb-2", children: /* @__PURE__ */ jsx(RichContent, { content: copyright }) }),
    description && /* @__PURE__ */ jsx("div", { className: "text-slate-400 dark:text-slate-500 text-xs md:text-sm tracking-wider font-medium opacity-80", children: /* @__PURE__ */ jsx(RichContent, { content: description }) })
  ] }) });
};
var define_CONFIG_default = { locales: { "/": { title: "Shang Cheng | Portfolio", langName: "EN", ui: { themeToggle: "Toggle Theme", contact: "Contact" }, hero: { name: "Shang Cheng", welcome: "👋 Hi there, I am", titles: ["Theoretical Physics Researcher", "World Explorer"], avatar: "/avatar.png", bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop", medias: [{ icon: "fa6-brands:orcid", name: "ORCID", link: "https://orcid.org/0000-0001-8393-2329" }, { icon: "fa6-brands:google-scholar", name: "Google Scholar", link: "https://scholar.google.com/citations?user=-k8PWr8AAAAJ" }, { icon: "fa6-brands:linkedin-in", name: "iNSPIRE", link: "https://inspirehep.net/authors/2662928" }, { icon: "fa6-brands:x-twitter", name: "X", link: "https://x.com/Shangc1204" }] }, navbar: { links: [{ label: "Profile", anchor: "#profile" }, { label: "Education", anchor: "#education" }, { label: "News", anchor: "#news" }, { label: "Publications", anchor: "#publications" }, { label: "Gallery", anchor: "#gallery" }] }, contents: [{ type: "profile", id: "profile", title: "Profile", icon: "user-tie", data: { fields: [{ title: "Affiliation", icon: "building-columns", value: "Analytical Quantum Complexity RIKEN Hakubi Research Team" }, { title: "Interests", icon: "heart", value: ["B-boying (Breaking)", "Gomoku", "Music", "Running"] }], contact: [{ label: "RIKEN Email", value: "cheng.shang@riken.jp", icon: "envelope" }, { label: "Gmail", value: "shangc1204@gmail.com", icon: "fa6-brands:google" }, { label: "UTokyo Email", value: "c-shang@iis.u-tokyo.ac.jp", icon: "building-columns" }], slogan: "Theoretical physics is the pursuit of understanding the fundamental structure of reality through logic and beauty." } }, { type: "experience", id: "education", title: "Education", icon: "graduation-cap", data: [{ type: "work", place: "Center for Quantum Computing, Analytical Quantum Complexity RIKEN Hakubi Research Team", time: "Oct. 2024 - Present", title: "Postdoctoral Researcher, with Dr. <a href='https://kuwahara-quantum.com/en/' target='_blank'>Tomotaka Kuwahara</a>" }, { type: "work", place: "Center for Quantum Computing, Analytical Quantum Complexity RIKEN Hakubi Research Team", time: "Apr. 2023 - Sep. 2024", title: "Junior Research Associate, with Dr. <a href='https://kuwahara-quantum.com/en/' target='_blank'>Tomotaka Kuwahara</a>" }, { type: "study", place: "The University of Tokyo, Japan", time: "Oct. 2021 - Sep. 2024", title: "Ph.D. with Prof. <a href='http://hatano-lab.iis.u-tokyo.ac.jp/index-e.html' target='_blank'>Naomichi Hatano</a>", content: "Department of Physics" }, { type: "study", place: "Students to Japan, China", time: "Oct. 2020 - Aug. 2021", content: "Preparatory School for Chinese<br>MEXT Doctoral Scholarship Candidate" }, { type: "study", place: "Northeast Normal University, China", time: "Sep. 2017 - June 2020", title: "Master of Science, with Prof. <a href='https://cqs.nenu.edu.cn/' target='_blank'>XueXi Yi</a>", description: "School of Physics" }] }, { type: "banner", id: "cfp", title: "Call for Papers", icon: "bullhorn", subtitle: "Special Collection: Exception Points in non-Hermitian Systems", data: { content: '<strong>Journal</strong>: Discover Physics (Springer Nature)\n\nFor inquiries, please contact: <a href="mailto:cheng.shang@riken.jp">cheng.shang@riken.jp</a> or <a href="mailto:shenhz458@nenu.edu.cn">shenhz458@nenu.edu.cn</a>', footer: "Submission Deadline: 21 April, 2026", actions: [{ label: "Submit & Learn More", link: "https://link.springer.com/collections/djheehghia", primary: true }] } }, { type: "timeline", id: "news", title: "News", icon: "newspaper", data: [{ year: "2025", content: 'Our work on “<a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401">Topological Quantum Batteries</a>” was featured in <a href="https://x.com/PhysRevLett/status/1924474721149542443">PRL Trending</a>.' }, { year: "2025", content: 'Our work on “<a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401">Topological Quantum Batteries</a>” was highlighted in press releases by <a href="https://www.riken.jp/en/news_pubs/research_news/pr/2025/20250513_2/index.html">RIKEN</a> and selected for <a href="https://www.riken.jp/en/news_pubs/pubs/riken_research/2025/index.html">RIKEN Research (Summer)</a>. It also received coverage from <a href="https://news.mynavi.jp/techplus/article/20250514-3319145/">Mynavi News</a>, <a href="https://www.nikkei.com/prime/tech-foresight/article/DGXZQOUC235SW0T20C25A5000000">NIKKEI Tech Foresight</a>, <a href="https://phys.org/news/2025-06-topological-quantum-batteries-theoretical-framework.html#google_vignette">PHYS.ORG</a>, <a href="https://interestingengineering.com/energy/new-quantum-battery-design">Interesting Engineering</a>, <a href="https://focus.ua/digital/708987-kvantovye-batarei-smogut-zaryazhat-smartfony-za-sekundy-kak-etogo-dobyutsya-uchenye">ФОКУС</a>, <a href="https://www.alphagalileo.org/en-gb/Item-Display/ItemId/259206?returnurl=https://www.alphagalileo.org/en-gb/Item-Display/ItemId/259206">AGAlphaGalileo</a>, <a href="https://www.miragenews.com/advent-of-topological-quantum-battery-1477588/">MIRAGE</a>, <a href="https://www.azoquantum.com/News.aspx?newsID=10819">AZO Quantum</a>, <a href="https://www.enerzine.com/lavenement-de-la-batterie-quantique-topologique/165028-2025-06">Enerzine</a>, <a href="https://www.yourweather.co.uk/news/science/japanese-scientists-propose-a-quantum-battery-design-that-resists-energy-loss.html">Methored UK</a>, and <a href="https://www.basicthinking.de/blog/2025/11/12/topologische-quantenbatterie/">BASIC thinking</a>.' }, { year: "2024", content: 'Joined the <a href="https://kuwahara-quantum.com/en/people/">Kuwahara team</a> as a Postdoctoral Researcher (Special Research Fellow) on October 1st.' }, { year: "2024", content: 'Presented a poster titled “Equivalence between Operator Spreading and Information Propagation” at <a href="https://qip2024.tw/site/mypage.aspx?pid=263&amp;lang=en&amp;sid=1522">QIP2024</a>, <a href="https://tqc-conference.org/posters/?tgid=44">TQC2024</a>, and <a href="https://quantum-innovation2024.jp/program/poster_cc.html">Quantum Innovation 2024</a>.' }, { year: "2024", content: "Received Ph.D. degree (No. HAKU RI 7661) from the University of Tokyo on September 20." }, { year: "2022 & 2024", content: 'Organized the “Stat&amp;QuantPhys Autumn and Winter School” workshops (<a href="http://hatano-lab.iis.u-tokyo.ac.jp/manami/SQP2022/">SQP2021</a>, <a href="http://hatano-lab.iis.u-tokyo.ac.jp/norihiro/SQP2024/">SQP2024</a>) as a committee member.' }, { year: "2021–2024", content: 'Presented talks at <a href="https://www.jps.or.jp/english/">The Physical Society of Japan</a> meetings.' }, { year: "2021", content: 'Joined the <a href="http://hatano-lab.iis.u-tokyo.ac.jp/index-e.html">Hatano Laboratory</a> at the University of Tokyo as a MEXT Scholarship doctoral student.' }, { year: "2019", content: "Gave a talk at the Symposium on Frontiers and Progress in Quantum Physics at Inner Mongolia University." }, { year: "2017", content: 'Joined Prof. <a href="https://cqs.nenu.edu.cn/">Yi Xuexi’s laboratory</a> at the Center for Quantum Sciences for Master’s research.' }] }, { type: "list", id: "awards", title: "Honors & Awards", icon: "trophy", unordered: true, dot: "check", data: [{ text: '<strong>2024</strong> Invited Talk, <a href="https://events.physics.uoc.gr/event/1/page/5-speakers">21st International Workshop on Pseudo-Hermitian Hamiltonians in Quantum Physics (PHHQP-XXI)</a>, Chania, Greece.' }, { text: '<strong>2023</strong> Best Poster Award, <a href="http://en.baqis.ac.cn/news/detail/?cid=1764">5th International Symposium on Quantum Physics and Quantum Information Sciences (QPQIS-2023)</a>, Beijing, China.' }, { text: "<strong>2021</strong> Japanese Government (MEXT) Doctoral Scholarship." }, { text: "<strong>2019</strong> Chinese National Scholarship for Postgraduates." }] }, { type: "list", id: "publications", title: "Publications", icon: "scroll", data: [{ text: '<a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401">Zhi-Guang Lu, Guo-Qing Tian, Xin-You Lü, and Cheng Shang, Topological Quantum Batteries, Phys. Rev. Lett. 134, 180401 (2025)</a>' }, { text: '<a href="https://journals.aps.org/pra/abstract/10.1103/PhysRevA.111.063702">Bo-Wang Zhang, Cheng Shang, J. Y. Sun, Zhuo-Cheng Gu, and X. X. Yi, Manipulating spectral transitions and photonic transmission in a non-Hermitian optical system through nanoparticle perturbations, Phys. Rev. A 111, 063702 (2025)</a>' }, { text: '<a href="https://journals.aps.org/prapplied/abstract/10.1103/PhysRevApplied.21.044048">Cheng Shang and Hong-Chao Li, Resonance-dominant optomechanical entanglement in open quantum systems, Physical Review Applied 21 (4), 044048 (2024)</a>' }, { text: '<a href="https://journals.aps.org/pra/abstract/10.1103/PhysRevA.108.053703">Zhi-Guang Lu, Cheng Shang, Ying Wu, and Xin-You Lü, Analytical approach to higher-order correlation functions in U(1) symmetric systems, Physical Review A 108, 053703 (2023)</a>' }, { text: '<a href="https://link.springer.com/article/10.1007/s10773-019-04229-x">H. Y. Sun, Cheng Shang, X. X. Luo, Y. H. Zhou, and Hong-Zhi Shen, Optical-assisted Photon Blockade in a Cavity System via Parametric Interactions, International Journal of Theoretical Physics 58, 3640-3650 (2019)</a>' }, { text: '<a href="https://opg.optica.org/oe/fulltext.cfm?uri=oe-27-18-25882&amp;id=417227">Cheng Shang, Hong-Zhi Shen, and Xue-Xi Yi, Nonreciprocity in a strongly coupled three-mode optomechanical circulatory system, Optics Express 27 (18), 25882-25901 (2019)</a>' }, { text: '<a href="https://journals.aps.org/pra/abstract/10.1103/PhysRevA.98.023856">Hong-Zhi Shen, Cheng Shang, Y. H. Zhou, and Xue-Xi Yi, Unconventional single-photon blockade in non-Markovian systems, Physical Review A 98 (2), 023856 (2018)</a>' }] }, { type: "list", id: "preprints", title: "Preprints", icon: "clock-rotate-left", data: [{ text: '<a href="https://arxiv.org/abs/2509.12014">Donghoon Kim, Yusuke Kimura, Hugo Mackay, Yosuke Mitsuhashi, Hideaki Nishikawa, Carla Rubiliani, Cheng Shang, Ayumi Ukai, and Tomotaka Kuwahara, Spectral Small-Incremental-Entangling: Breaking Quasi-Polynomial Complexity Barriers in Long-Range Interacting Systems, arXiv:2509.12014 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2505.07955">Cheng Shang, Zhi-Guang Lu, Hayato Kinkawa, and Tomotaka Kuwahara, Operator Spreading and Information Propagation: Equivalence and Beyond, arXiv:2505.07955 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2503.13731">Hongchao Li, Cheng Shang, Tomotaka Kuwahara, and Tan Van Vu, Macroscopic Particle Transport in Dissipative Long-Range Bosonic Systems, arXiv:2503.13731 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2505.10255">J. X. Yang, Cheng Shang, Yan-Hui Zhou, and H. Z. Shen, Simultaneous nonreciprocal unconventional photon blockade via two degenerate optical parametric amplifiers in spinning resonators, arXiv:2505.10255 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2504.09695">J. Y. Sun, C. Cui, Y. F. Li, Shuang Xu, Cheng Shang, Yan-Hui Zhou, and H. Z. Shen, Dressed bound states and non-Markovian dynamics with a whispering-gallery-mode microcavity coupled to a two-level atom and a semi-infinite photonic waveguide, arXiv:2504.09695 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2504.00617">L. Y. Ning, Zhi-Guang Lu, Cheng Shang, and H. Z. Shen, Higher-order Exceptional Points Induced by Non-Markovian Environments, arXiv:2504.00617 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2503.23169">H. Yi, T. Z. Luan, W. Y. Hu, Cheng Shang, Yan-Hui Zhou, Zhi-Cheng Shi, and H. Z. Shen, Nonreciprocity and unidirectional invisibility in three optical modes with non-Markovian effects, arXiv:2503.23169 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2503.21739">H. Z. Shen, Cheng Shang, Yan-Hui Zhou, and X. X. Yi, Emergent Non-Markovian Gain in Open Quantum Systems, arXiv:2503.21739 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2503.18647">T. Z. Luan, Cheng Shang, H. Yi, J. L. Li, Yan-Hui Zhou, Shuang Xu, and H. Z. Shen, Nonreciprocal quantum router with non-Markovian environments, arXiv:2503.18647 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2302.04897">Cheng Shang and H. Z. Shen, Coupling Enhancement and Symmetrization in Dissipative Optomechanical Systems, arXiv:2302.04897 (2025)</a>' }] }, { type: "list", id: "acknowledgments", title: "Acknowledged Contributions (Selected)", icon: "heart", data: [{ text: '<a href="https://arxiv.org/abs/2507.02070">Yue-Zhou Li, Stochastic inflation as an open quantum system, arXiv: 2507.02070 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2506.05335">M. E. Shirokov, Upper bounds on the Holevo quantity arising from the fundamental entropic inequality, arXiv: 2506.05335 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2407.05835">Tomotaka Kuwahara, Clustering of conditional mutual information and quantum Markov structure at arbitrary temperatures, arXiv: 2407.05835 (2024)</a>' }, { text: '<a href="https://escholarship.mcgill.ca/concern/theses/cj82kd73h">Yue-Zhou Li, Holographic conformal field theories and their flat-space structures, 2023 PhD Theses (McGill University)</a>' }, { text: '<a href="http://hatano-lab.iis.u-tokyo.ac.jp/thesis/dron2022/thesis_yoshinaga.pdf">Yoshinaga Atsuki, Quantum Thermalization and Quantum Metrology in Quantum Ising Systems, 2023 PhD Theses (The University of Tokyo)</a>' }, { text: '<a href="https://sites.google.com/view/hongchaoliquantum/">Hongchao Li, QUantum Many-Body Theory of Dissipative Superfluidity, 2023 Master Thesis (The University of Tokyo)</a>' }] }, { type: "list", id: "patents", title: "Patents", icon: "certificate", unordered: true, data: [{ text: '<a href="https://patents.google.com/patent/CN108958706B/en">Cheng Shang, Hui Zhao, Xuan Zhang, Fu-De Li, and He Bai, Grayscale Mechanical Random Number Generator: Testing and Usage Methodologies, CN Patent CN108,958,706 B (2023)</a>' }] }, { type: "gallery", id: "gallery", title: "Gallery", icon: "images", data: [{ url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop", title: "PHHQP-XXI Workshop", location: "Chania, Greece", date: "2024", description: "Presenting my research on open quantum systems. The discussions overlooking the Mediterranean were truly inspiring." }, { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop", title: "Mountain Hiking", location: "Japan Alps", date: "2023", description: "Recharging amidst the breathtaking landscapes of the Japan Alps. Nature provides a perfect backdrop for deep reflection." }, { url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1000&auto=format&fit=crop", title: "Breaking Practice", location: "Tokyo", date: "2024", description: "Dynamics exist in movement too. Breaking (B-boying) has been my passion for years, teaching me discipline and creative expression." }, { url: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1000&auto=format&fit=crop", title: "Gomoku Strategy", location: "Kyoto", date: "2023", description: "The elegance of logic in a board game. Gomoku is a great way to train strategic thinking outside of physics." }, { url: "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1000&auto=format&fit=crop", title: "Early Morning Run", location: "Tokyo Bay", date: "2024", description: "Running helps me maintain a clear mind. It is the best way to start a day of intense theoretical research." }, { url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop", title: "Physics Library", location: "UTokyo", date: "2024", description: "The sanctuary of knowledge where most of my doctoral dissertation took shape." }] }, { type: "paragraph", id: "closing", title: "Looking Forward", icon: "star", data: "I am always looking for collaborative opportunities at the intersection of <strong>quantum complexity</strong> and <strong>open quantum systems</strong>. Feel free to reach out for research discussions or joint explorations of the fundamental structures of our universe." }], footer: { copyright: "© 2025 SHANG CHENG. All rights reserved.", description: "Built with Physics and Love." } }, "/zh/": { title: "尚程 | 个人主页", langName: "中文", ui: { themeToggle: "切换主题", contact: "联系方式" }, hero: { name: "尚  程", welcome: "👋 你好，我是", titles: ["理论物理研究员", "世界探索者"], avatar: "/avatar.png", bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop", medias: [{ icon: "fa6-brands:orcid", name: "ORCID", link: "https://orcid.org/0000-0001-8393-2329" }, { icon: "fa6-brands:google-scholar", name: "谷歌学术", link: "https://scholar.google.com/citations?user=-k8PWr8AAAAJ&hl=zh-CN" }, { icon: "fa6-brands:linkedin-in", name: "iNSPIRE", link: "https://inspirehep.net/authors/2662928" }, { icon: "fa6-brands:x-twitter", name: "X", link: "https://x.com/Shangc1204" }] }, navbar: { links: [{ label: "个人简介", anchor: "#profile" }, { label: "教育经历", anchor: "#education" }, { label: "新闻动态", anchor: "#news" }, { label: "研究成果", anchor: "#publications" }, { label: "相册", anchor: "#gallery" }] }, contents: [{ type: "profile", id: "profile", title: "个人简介", icon: "user-tie", data: { fields: [{ title: "所属机构", icon: "building-columns", value: "RIKEN Hakubi 研究团队 分析量子复杂性研究组" }, { title: "个人爱好", icon: "heart", value: ["街舞（Breaking）", "五子棋", "音乐", "跑步"] }], contact: [{ label: "RIKEN 邮箱", value: "cheng.shang@riken.jp", icon: "envelope" }, { label: "Gmail", value: "shangc1204@gmail.com", icon: "fa6-brands:google" }, { label: "东京大学邮箱", value: "c-shang@iis.u-tokyo.ac.jp", icon: "building-columns" }], slogan: "理论物理是对通过逻辑与美感来理解现实基本结构的追求。" } }, { type: "experience", id: "education", title: "教育经历", icon: "graduation-cap", data: [{ type: "work", place: "量子计算中心，分析量子复杂性 RIKEN Hakubi 研究团队", time: "2024 年 10 月 - 至今", title: "博士后，和<a href='https://kuwahara-quantum.com/en/' target='_blank'>桑原知剛</a>博士" }, { type: "work", place: "量子计算中心，分析量子复杂性 RIKEN Hakubi 研究团队", time: "2023 年 4 月 - 2024 年 9 月", title: "初级研究员，和<a href='https://kuwahara-quantum.com/en/' target='_blank'>桑原知剛</a>博士" }, { type: "study", place: "东京大学，日本", time: "2021 年 10 月 - 2024 年 9 月", title: "博士，和<a href='http://hatano-lab.iis.u-tokyo.ac.jp/index-e.html' target='_blank'>羽田野直道</a>教授", content: "物理系" }, { type: "study", place: "留日学生，中国", time: "2020 年 10 月 - 2021 年 8 月", content: "中国留日预校<br>MEXT 博士奖学金候选人" }, { type: "study", place: "东北师范大学，中国", time: "2017 年 9 月 - 2020 年 6 月", title: "理学硕士，和<a href='https://cqs.nenu.edu.cn/' target='_blank'>衣学喜</a>教授", description: "物理学院" }] }, { type: "banner", id: "cfp", title: "特刊征稿", icon: "bullhorn", subtitle: "Special Collection: Exception Points in non-Hermitian Systems", data: { content: '<strong>期刊</strong>: Discover Physics (Springer Nature)\n\n如有疑问，请联系: <a href="mailto:cheng.shang@riken.jp">cheng.shang@riken.jp</a> 或 <a href="mailto:shenhz458@nenu.edu.cn">shenhz458@nenu.edu.cn</a>', footer: "截止日期: 2026 年 4 月 21 日", actions: [{ label: "投稿与详情", link: "https://link.springer.com/collections/djheehghia", primary: true }] } }, { type: "timeline", id: "news", title: "新闻动态", icon: "newspaper", data: [{ year: "2025", content: '我们的工作“<a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401">拓扑量子电池</a>”入选 <a href="https://x.com/PhysRevLett/status/1924474721149542443">PRL Trending</a>。' }, { year: "2025", content: '我们的工作“<a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401">拓扑量子电池</a>”被<a href="https://www.riken.jp/press/2025/20250513_2/index.html">理化学研究所</a>发布新闻稿报道，并入选<a href="https://www.riken.jp/en/news_pubs/pubs/riken_research/2025/index.html">理化学研究所（夏季）专刊</a>。此外，该工作还被 <a href="https://news.mynavi.jp/techplus/article/20250514-3319145/">マイナビニュース</a>、<a href="https://www.nikkei.com/prime/tech-foresight/article/DGXZQOUC235SW0T20C25A5000000">日本経済新聞</a>、<a href="https://phys.org/news/2025-06-topological-quantum-batteries-theoretical-framework.html#google_vignette">PHYS.ORG</a>、<a href="https://interestingengineering.com/energy/new-quantum-battery-design">Interesting Engineering</a>、<a href="https://focus.ua/digital/708987-kvantovye-batarei-smogut-zaryazhat-smartfony-za-sekundy-kak-etogo-dobyutsya-uchenye">ФОКУС</a>、<a href="https://www.alphagalileo.org/en-gb/Item-Display/ItemId/259206?returnurl=https://www.alphagalileo.org/en-gb/Item-Display/ItemId/259206">AGAlphaGalileo</a>、<a href="https://www.miragenews.com/advent-of-topological-quantum-battery-1477588/">MIRAGE</a>、<a href="https://www.azoquantum.com/News.aspx?newsID=10819">AZO Quantum</a>、<a href="https://www.enerzine.com/lavenement-de-la-batterie-quantique-topologique/165028-2025-06">Enerzine</a>、<a href="https://www.yourweather.co.uk/news/science/japanese-scientists-propose-a-quantum-battery-design-that-resists-energy-loss.html">Methored UK</a> 和 <a href="https://www.basicthinking.de/blog/2025/11/12/topologische-quantenbatterie/">BASIC thinking</a> 等多家媒体报道。' }, { year: "2024", content: '10 月 1 日，作为特别研究员（博士后）加入<a href="https://kuwahara-quantum.com/en/people/">桑原团队</a>。' }, { year: "2024", content: '参加国际量子信息处理会议 (<a href="https://qip2024.tw/site/mypage.aspx?pid=263&amp;lang=en&amp;sid=1522">QIP2024</a>)、第 19 届量子计算、通信与密码理论会议 (<a href="https://tqc-conference.org/posters/?tgid=44">TQC2024</a>) 及国际会议“<a href="https://quantum-innovation2024.jp/program/poster_cc.html">量子创新</a>”，并展示海报《算符传播等价于信息传输》。' }, { year: "2024", content: "9 月 20 日，获东京大学博士学位（证书编号：HAKU RI 7661）。" }, { year: "2022 & 2024", content: '作为组委会成员，组织“统计与量子物理秋冬学校”研讨会 (<a href="http://hatano-lab.iis.u-tokyo.ac.jp/manami/SQP2022/">SQP2021</a>, <a href="http://hatano-lab.iis.u-tokyo.ac.jp/norihiro/SQP2024/">SQP2024</a>)。' }, { year: "2021–2024", content: '多次在<a href="https://www.jps.or.jp/english/">日本物理学会</a>年会作口头报告。' }, { year: "2021", content: '获日本政府（MEXT）奖学金，加入东京大学物理系<a href="http://hatano-lab.iis.u-tokyo.ac.jp/index-e.html">羽田野研究室</a>攻读博士学位。' }, { year: "2019", content: "在内蒙古大学举办的“量子物理前沿与进展”研讨会上作大会口头报告。" }, { year: "2017", content: '加入量子科学中心<a href="https://cqs.nenu.edu.cn/">衣学喜教授研究室</a>攻读硕士学位。' }] }, { type: "list", id: "awards", title: "荣誉与奖项", icon: "trophy", unordered: true, dot: "check", data: [{ text: '<strong>2024</strong> 邀请报告，<a href="https://events.physics.uoc.gr/event/1/page/5-speakers">第 21 届赝厄密哈密顿量量子物理学国际研讨会 (PHHQP-XXI)</a>，希腊哈尼亚。' }, { text: '<strong>2023</strong> 最佳海报奖，<a href="http://www.baqis.ac.cn/news/detail/?cid=1879">第 5 届量子物理与量子信息科学国际研讨会 (QPQIS-2023)</a>，中国北京。' }, { text: "<strong>2021</strong> 日本政府 (MEXT) 博士奖学金。" }, { text: "<strong>2019</strong> 中国研究生国家奖学金。" }] }, { type: "cards", id: "theses", title: "学位论文", icon: "book", data: [{ title: "开放量子系统中的退相干抑制：共振与拓扑效应", subtitle: "博士论文", link: "http://hatano-lab.iis.u-tokyo.ac.jp/thesis/dron2024/thesis_shang.pdf", category: "学位论文", action: "查看 PDF", icon: "file-pdf" }, { title: "基于可控光力系统的非互易传输", subtitle: "硕士论文", link: "https://kns.cnki.net/kcms2/article/abstract?v=sKJ9SXrFdEp3keNUa73wzZt2qsRh5sWMxp5xQXa5xpBeTgFa1dFLKxs8M76AJIPfu9z0sGis4GQV4nGLHFPKoy1SHuG1EKoQBfxTZbDpPTdVr8t6MkR_5gBEUgaza4vOHMjGLqFT4ignRy17YZpEbU2JEKK8t6AyW5ra24e4BX52qtBj5VUVcz2R5MufKnOYWiJbdYuAjEI=&language=CHS", category: "学位论文", action: "查看 PDF", icon: "file-pdf" }] }, { type: "list", id: "publications", title: "期刊论文", icon: "scroll", data: [{ text: '<a href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.134.180401">Zhi-Guang Lu, Guo-Qing Tian, Xin-You Lü, and Cheng Shang, Topological Quantum Batteries, Phys. Rev. Lett. 134, 180401 (2025)</a>' }, { text: '<a href="https://journals.aps.org/pra/abstract/10.1103/PhysRevA.111.063702">Bo-Wang Zhang, Cheng Shang, J. Y. Sun, Zhuo-Cheng Gu, and X. X. Yi, Manipulating spectral transitions and photonic transmission in a non-Hermitian optical system through nanoparticle perturbations, Phys. Rev. A 111, 063702 (2025)</a>' }, { text: '<a href="https://journals.aps.org/prapplied/abstract/10.1103/PhysRevApplied.21.044048">Cheng Shang and Hong-Chao Li, Resonance-dominant optomechanical entanglement in open quantum systems, Physical Review Applied 21 (4), 044048 (2024)</a>' }, { text: '<a href="https://journals.aps.org/pra/abstract/10.1103/PhysRevA.108.053703">Zhi-Guang Lu, Cheng Shang, Ying Wu, and Xin-You Lü, Analytical approach to higher-order correlation functions in U(1) symmetric systems, Physical Review A 108, 053703 (2023)</a>' }, { text: '<a href="https://link.springer.com/article/10.1007/s10773-019-04229-x">H. Y. Sun, Cheng Shang, X. X. Luo, Y. H. Zhou, and Hong-Zhi Shen, Optical-assisted Photon Blockade in a Cavity System via Parametric Interactions, International Journal of Theoretical Physics 58, 3640-3650 (2019)</a>' }, { text: '<a href="https://opg.optica.org/oe/fulltext.cfm?uri=oe-27-18-25882&amp;id=417227">Cheng Shang, Hong-Zhi Shen, and Xue-Xi Yi, Nonreciprocity in a strongly coupled three-mode optomechanical circulatory system, Optics Express 27 (18), 25882-25901 (2019)</a>' }, { text: '<a href="https://journals.aps.org/pra/abstract/10.1103/PhysRevA.98.023856">Hong-Zhi Shen, Cheng Shang, Y. H. Zhou, and Xue-Xi Yi, Unconventional single-photon blockade in non-Markovian systems, Physical Review A 98 (2), 023856 (2018)</a>' }] }, { type: "list", id: "preprints", title: "预印本论文", icon: "clock-rotate-left", data: [{ text: '<a href="https://arxiv.org/abs/2509.12014">Donghoon Kim, Yusuke Kimura, Hugo Mackay, Yosuke Mitsuhashi, Hideaki Nishikawa, Carla Rubiliani, Cheng Shang, Ayumi Ukai, and Tomotaka Kuwahara, Spectral Small-Incremental-Entangling: Breaking Quasi-Polynomial Complexity Barriers in Long-Range Interacting Systems, arXiv:2509.12014 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2505.07955">Cheng Shang, Zhi-Guang Lu, Hayato Kinkawa, and Tomotaka Kuwahara, Operator Spreading and Information Propagation: Equivalence and Beyond, arXiv:2505.07955 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2503.13731">Hongchao Li, Cheng Shang, Tomotaka Kuwahara, and Tan Van Vu, Macroscopic Particle Transport in Dissipative Long-Range Bosonic Systems, arXiv:2503.13731 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2505.10255">J. X. Yang, Cheng Shang, Yan-Hui Zhou, and H. Z. Shen, Simultaneous nonreciprocal unconventional photon blockade via two degenerate optical parametric amplifiers in spinning resonators, arXiv:2505.10255 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2504.09695">J. Y. Sun, C. Cui, Y. F. Li, Shuang Xu, Cheng Shang, Yan-Hui Zhou, and H. Z. Shen, Dressed bound states and non-Markovian dynamics with a whispering-gallery-mode microcavity coupled to a two-level atom and a semi-infinite photonic waveguide, arXiv:2504.09695 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2504.00617">L. Y. Ning, Zhi-Guang Lu, Cheng Shang, and H. Z. Shen, Higher-order Exceptional Points Induced by Non-Markovian Environments, arXiv:2504.00617 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2503.23169">H. Yi, T. Z. Luan, W. Y. Hu, Cheng Shang, Yan-Hui Zhou, Zhi-Cheng Shi, and H. Z. Shen, Nonreciprocity and unidirectional invisibility in three optical modes with non-Markovian effects, arXiv:2503.23169 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2503.21739">H. Z. Shen, Cheng Shang, Yan-Hui Zhou, and X. X. Yi, Emergent Non-Markovian Gain in Open Quantum Systems, arXiv:2503.21739 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2503.18647">T. Z. Luan, Cheng Shang, H. Yi, J. L. Li, Yan-Hui Zhou, Shuang Xu, and H. Z. Shen, Nonreciprocal quantum router with non-Markovian environments, arXiv:2503.18647 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2302.04897">Cheng Shang and H. Z. Shen, Coupling Enhancement and Symmetrization in Dissipative Optomechanical Systems, arXiv:2302.04897 (2025)</a>' }] }, { type: "list", id: "acknowledgments", title: "获致谢工作（遴选）", icon: "heart", data: [{ text: '<a href="https://arxiv.org/abs/2507.02070">Yue-Zhou Li, Stochastic inflation as an open quantum system, arXiv: 2507.02070 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2506.05335">M. E. Shirokov, Upper bounds on the Holevo quantity arising from the fundamental entropic inequality, arXiv: 2506.05335 (2025)</a>' }, { text: '<a href="https://arxiv.org/abs/2407.05835">Tomotaka Kuwahara, Clustering of conditional mutual information and quantum Markov structure at arbitrary temperatures, arXiv: 2407.05835 (2024)</a>' }, { text: '<a href="https://escholarship.mcgill.ca/concern/theses/cj82kd73h">Yue-Zhou Li, Holographic conformal field theories and their flat-space structures, 2023 PhD Theses (McGill University)</a>' }, { text: '<a href="http://hatano-lab.iis.u-tokyo.ac.jp/thesis/dron2022/thesis_yoshinaga.pdf">Yoshinaga Atsuki, Quantum Thermalization and Quantum Metrology in Quantum Ising Systems, 2023 PhD Theses (The University of Tokyo)</a>' }, { text: '<a href="https://sites.google.com/view/hongchaoliquantum/">Hongchao Li, Quantum Many-Body Theory of Dissipative Superfluidity, 2023 Master Thesis (The University of Tokyo)</a>' }] }, { type: "list", id: "patents", title: "专利", icon: "certificate", unordered: true, data: [{ text: '<a href="https://patents.google.com/patent/CN108958706B/zh">Cheng Shang, Hui Zhao, Xuan Zhang, Fu-De Li, and He Bai, 测灰度机械随机数生成器及其使用方法, CN Patent CN108,958,706 B (2023)</a>' }] }, { type: "gallery", id: "gallery", title: "相册", icon: "images", data: [{ url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop", title: "学术会议报告", location: "希腊，哈尼亚", date: "2024", description: "在 PHHQP-XXI 研讨会上分享关于开放量子系统的研究。在这一充满历史气息的海滨城市与全球同行交流，碰撞出许多科研灵感的火花。" }, { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop", title: "山间漫步", location: "日本阿尔卑斯山", date: "2023", description: "在自然的怀抱中寻找平衡。徒步远行是我在繁忙科研之余，清空思绪、重新获取能量的最佳方式。" }, { url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1000&auto=format&fit=crop", title: "街舞练功房", location: "东京", date: "2024", description: "动态与复杂性同样存在于肢体动作中。多年的街舞练习让我学会了自律，更在节奏与对抗中找到了另一种表达自我的语言。" }, { url: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1000&auto=format&fit=crop", title: "五子棋博弈", location: "京都", date: "2023", description: "逻辑的优雅在棋盘上流淌。五子棋是物理研究之外极佳的思维训练方式。" }, { url: "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=1000&auto=format&fit=crop", title: "晨跑时光", location: "东京湾", date: "2024", description: "跑步让我保持头脑清醒，是开启一天高强度理论研究的最好方式。" }, { url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop", title: "物理系图书馆", location: "东京大学", date: "2024", description: "知识的殿堂，我的博士论文大部分内容在这里成型。" }] }, { type: "paragraph", id: "closing", title: "未来展望", icon: "star", data: "我始终期待在 <strong>量子复杂性</strong> 与 <strong>开放量子系统</strong> 的交叉领域展开合作。如果您对科研讨论或共同探索宇宙的基本结构感兴趣，欢迎通过邮箱与我联系。" }], footer: { copyright: "© 2025 尚 程. 保留所有权利。", description: "以物理之名，致敬热爱。" } } } };
const { experienceStyles, locales } = define_CONFIG_default;
const localePaths = Object.keys(locales);
const getLocaleFromPath = (path) => {
  const sortedPaths = [...localePaths].sort((a, b) => b.length - a.length);
  for (const localePath of sortedPaths) {
    if (localePath === "/") continue;
    if (path.startsWith(localePath)) return localePath;
  }
  return "/";
};
const App = ({ initialLocale }) => {
  const [locale, setLocale] = useState(() => {
    if (initialLocale) return initialLocale;
    if (typeof window !== "undefined")
      return getLocaleFromPath(window.location.pathname);
    return localePaths[0];
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });
  const [config, setConfig] = useState(locales[locale]);
  useEffect(() => {
    document.title = config.title ?? "Portfolio";
  }, [config]);
  useEffect(() => {
    setConfig(locales[locale]);
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const newPath = locale === "/" ? "/" : locale;
      if (currentPath !== newPath && !(currentPath === "/" && newPath === "/")) {
        window.history.pushState(null, "", newPath);
      }
    }
  }, [locale]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const onPopState = () => {
        setLocale(getLocaleFromPath(window.location.pathname));
      };
      window.addEventListener("popstate", onPopState);
      return () => {
        window.removeEventListener("popstate", onPopState);
      };
    }
  }, []);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => prev === "light" ? "dark" : "light");
  const handleLocaleChange = () => {
    const currentIndex = localePaths.indexOf(locale);
    const nextIndex = (currentIndex + 1) % localePaths.length;
    setLocale(localePaths[nextIndex]);
  };
  const nextLocale = localePaths[(localePaths.indexOf(locale) + 1) % localePaths.length];
  const nextLocaleName = locales[nextLocale].langName ?? "Switch Language";
  const renderContent = (content) => {
    switch (content.type) {
      case "profile":
        return /* @__PURE__ */ jsx(Profile, { data: content.data, ui: config.ui });
      case "experience":
        return /* @__PURE__ */ jsx(
          Experience,
          {
            items: content.data,
            locale,
            styles: experienceStyles
          }
        );
      case "banner": {
        return /* @__PURE__ */ jsx(
          Banner,
          {
            title: content.title,
            subtitle: content.subtitle ?? "",
            content: content.data.content,
            footer: content.data.footer,
            actions: content.data.actions
          }
        );
      }
      case "timeline":
        return /* @__PURE__ */ jsx(Timeline, { items: content.data });
      case "cards":
        return /* @__PURE__ */ jsx(Cards, { items: content.data, locale });
      case "list":
        return /* @__PURE__ */ jsx(
          List,
          {
            unordered: content.unordered,
            dot: content.dot,
            items: content.data
          }
        );
      case "gallery":
        return /* @__PURE__ */ jsx(Gallery, { items: content.data });
      case "paragraph":
        return /* @__PURE__ */ jsx(Paragraph, { content: content.data });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen selection:bg-primary-100 dark:selection:bg-primary-900 selection:text-primary-900 dark:selection:text-primary-100", children: [
    config.navbar && /* @__PURE__ */ jsx(
      Navbar,
      {
        links: config.navbar.links,
        nextLocaleName,
        onLocaleChange: handleLocaleChange,
        theme,
        onThemeChange: toggleTheme,
        themeLabel: config.ui?.themeToggle,
        brand: config.hero.name,
        showLocaleSwitch: localePaths.length > 1
      }
    ),
    /* @__PURE__ */ jsx(PortfolioHeader, { hero: config.hero, locale }),
    /* @__PURE__ */ jsx("main", { className: "container mx-auto px-6 max-w-7xl mt-12 md:mt-16", children: config.contents.map((block) => /* @__PURE__ */ jsx(
      SectionWrapper,
      {
        title: block.title,
        icon: block.icon,
        id: block.id,
        locale,
        children: renderContent(block)
      },
      block.id
    )) }),
    /* @__PURE__ */ jsx(
      Footer,
      {
        copyright: config.footer?.copyright ?? config.hero.name,
        description: config.footer?.description
      }
    )
  ] });
};
function render(url, config) {
  const { locales: locales2 } = config;
  const localePaths2 = Object.keys(locales2);
  let locale = "/";
  const sortedPaths = [...localePaths2].sort((a, b) => b.length - a.length);
  for (const localePath of sortedPaths) {
    if (localePath === "/") continue;
    if (url.startsWith(localePath)) {
      locale = localePath;
      break;
    }
  }
  return renderToString(/* @__PURE__ */ jsx(App, { initialLocale: locale }));
}
export {
  render
};
