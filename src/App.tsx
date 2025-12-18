import type { FC, ReactElement } from "react";
import { useState, useEffect } from "react";
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

export const App: FC<{ initialLocale?: string }> = ({ initialLocale }) => {
  const [localePath, setLocalePath] = useState<string>(
    () => initialLocale ?? getLocaleFromPath(),
  );
  const [localeConfig, setLocaleConfig] = useState<LocaleConfig>(
    locales[localePath],
  );

  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window === "undefined"
      ? "light"
      : ((localStorage.getItem("theme") as "light" | "dark" | undefined) ??
          window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark"
        : "light",
  );

  // update config and link based on locale path
  useEffect(() => {
    setLocaleConfig(locales[localePath]);

    if (typeof window === "undefined") return;

    if (window.location.pathname !== localePath) {
      window.history.pushState(null, "", localePath);
    }
  }, [localePath]);

  // update title and meta description based on locale config
  useEffect(() => {
    document.title = localeConfig.title ?? "Portfolio";
    document.documentElement.lang = localeConfig.lang;

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute(
      "content",
      localeConfig.description ?? "Portfolio Template",
    );
  }, [localeConfig]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPopState = (): void => {
      setLocalePath(getLocaleFromPath());
    };

    window.addEventListener("popstate", onPopState);

    return (): void => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (): void =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleLocaleChange = (): void => {
    const currentIndex = localePaths.indexOf(localePath);
    const nextIndex = (currentIndex + 1) % localePaths.length;

    setLocalePath(localePaths[nextIndex]);
  };

  const nextLocale =
    localePaths[(localePaths.indexOf(localePath) + 1) % localePaths.length];
  const nextLocaleName =
    locales[nextLocale].langName ?? locales[nextLocale].lang;

  const renderSection = (section: Section): ReactElement | null => {
    switch (section.type) {
      case "profile":
        return <Profile data={section.data} ui={localeConfig.ui} />;

      case "experience":
        return (
          <Experience
            items={section.data}
            locale={localePath}
            types={config.experienceTypes}
          />
        );

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

      case "timeline":
        return <Timeline items={section.data} ui={section.ui} />;

      case "cards":
        return <Cards items={section.data} locale={localePath} />;

      case "list":
        return <List dot={section.dot} items={section.data} />;

      case "gallery":
        return <Gallery items={section.data} />;

      case "markdown":
        return (
          <Markdown content={section.data.content} card={section.data.card} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen selection:bg-primary-100 dark:selection:bg-primary-900 selection:text-primary-900 dark:selection:text-primary-100">
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

      <main className="container mx-auto px-6 max-w-7xl mt-12 md:mt-16">
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
