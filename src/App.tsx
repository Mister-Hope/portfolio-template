// oxlint-disable import/max-dependencies
import type { FC, ReactElement } from "react";
import { useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import { Hero } from "./components/Hero.js";
import { SectionWrapper } from "./components/SectionWrapper.js";
import { Experience } from "./components/Experience.js";
import { Timeline } from "./components/Timeline.js";
import { Gallery } from "./components/Gallery.js";
import { Banner } from "./components/Banner.js";
import { Navbar } from "./components/Navbar.js";
import { Profile } from "./components/Profile.js";
import { Cards } from "./components/Cards.js";
import { List } from "./components/List.js";
import { Markdown } from "./components/Markdown.js";
import { Footer } from "./components/Footer.js";
import type { LocaleConfig, Section } from "./types/index.js";
import { getLocaleFromPath } from "./utils/getLocaleFromPath.js";
import { config, localePaths, locales } from "./config.js";
import { isSSR } from "./utils/index.js";

export const App: FC<{ initialLocale?: string }> = ({ initialLocale }) => {
  const [localePath, setLocalePath] = useState<string>(() => initialLocale ?? getLocaleFromPath());
  const [localeConfig, setLocaleConfig] = useState<LocaleConfig>(locales[localePath]);

  const [theme, setTheme] = useState<"light" | "dark">(() =>
    isSSR
      ? "light"
      : ((localStorage.getItem("theme") as "light" | "dark" | undefined) ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")),
  );

  // update config and link based on locale path
  useEffect(() => {
    setLocaleConfig(locales[localePath]);

    if (!isSSR && window.location.pathname !== localePath)
      window.history.pushState(null, "", localePath);
  }, [localePath]);

  // update title and meta description based on locale config
  useEffect(() => {
    document.title = localeConfig.title ?? "Portfolio";
    document.documentElement.lang = localeConfig.lang;

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.append(metaDescription);
    }

    metaDescription.setAttribute("content", localeConfig.description ?? "Portfolio Template");
  }, [localeConfig]);

  useEffect(() => {
    const onPopState = (): void => {
      setLocalePath(getLocaleFromPath());
    };

    window.addEventListener("popstate", onPopState);

    return (): void => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    window.document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(
    (event: React.MouseEvent): void => {
      const isAppearanceTransition =
        // @ts-expect-error: Providing backward compatibility
        document.startViewTransition &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!isAppearanceTransition) {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));

        return;
      }

      const pointerX = event.clientX;
      const pointerY = event.clientY;
      const endRadius = Math.hypot(
        Math.max(pointerX, window.innerWidth - pointerX),
        Math.max(pointerY, window.innerHeight - pointerY),
      );

      const isDark = theme === "light";

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(isDark ? "dark" : "light");
        });

        // Manually toggle class to ensure it's updated for the transition snapshot
        window.document.documentElement.classList.toggle("dark", isDark);
      });

      void transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${pointerX}px ${pointerY}px)`,
          `circle(${endRadius}px at ${pointerX}px ${pointerY}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath,
          },
          {
            duration: 400,
            easing: "ease-in",
            pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)",
          },
        );
      });
    },
    [theme],
  );

  const handleLocaleChange = useCallback((): void => {
    const currentIndex = localePaths.indexOf(localePath);
    const nextIndex = (currentIndex + 1) % localePaths.length;

    setLocalePath(localePaths[nextIndex]);
  }, [localePath]);

  const nextLocale = localePaths[(localePaths.indexOf(localePath) + 1) % localePaths.length];
  const nextLocaleName = locales[nextLocale].langName ?? locales[nextLocale].lang;

  const renderSection = (section: Section): ReactElement | null => {
    switch (section.type) {
      case "profile": {
        return <Profile data={section.data} ui={localeConfig.ui} />;
      }

      case "experience": {
        return (
          <Experience items={section.data} locale={localePath} types={config.experienceTypes} />
        );
      }

      case "banner": {
        return (
          <Banner
            header={section.data.header}
            content={section.data.content}
            footer={section.data.footer}
            tags={section.data.tags}
            actions={section.data.actions}
          />
        );
      }

      case "timeline": {
        return <Timeline items={section.data} ui={section.ui} />;
      }

      case "cards": {
        return <Cards items={section.data} locale={localePath} />;
      }

      case "list": {
        return <List dot={section.dot} items={section.data} />;
      }

      case "gallery": {
        return <Gallery items={section.data} />;
      }

      case "markdown": {
        return <Markdown content={section.data.content} card={section.data.card} />;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <div className="min-h-screen selection:bg-primary-100 selection:text-primary-900 dark:selection:bg-primary-900 dark:selection:text-primary-100">
      {localeConfig.navbar && (
        <Navbar
          links={localeConfig.navbar.links}
          nextLocaleName={nextLocaleName}
          onLocaleChange={handleLocaleChange}
          theme={theme}
          onThemeChange={toggleTheme}
          themeLabel={localeConfig.ui?.themeToggle}
          brand={localeConfig.hero.name}
          showLocaleSwitch={localePaths.length > 1}
        />
      )}

      <Hero hero={localeConfig.hero} locale={localePath} />

      <main className="container mx-auto mt-12 max-w-7xl px-6 md:mt-16">
        {localeConfig.sections.map((block) => (
          <SectionWrapper
            key={block.id}
            title={block.title}
            icon={block.icon}
            id={block.id}
            locale={localePath}
          >
            {renderSection(block)}
          </SectionWrapper>
        ))}
      </main>

      <Footer
        copyright={localeConfig.footer?.copyright ?? localeConfig.hero.name}
        description={localeConfig.footer?.description}
      />
    </div>
  );
};
