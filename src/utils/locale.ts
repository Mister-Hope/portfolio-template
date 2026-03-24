import { localePaths, locales } from "../config.js";
import { isSSR } from "./isSSR.js";

const sortedPaths = [...localePaths].sort((a, b) => b.length - a.length);

export const getBrowserLanguage = (): string | null => {
  // navigator.languages is ordered by preference, e.g., ["zh-CN", "zh", "en-US", "en"]
  const browserLangs = navigator.languages ?? [navigator.language];

  // First pass: exact match for all browser languages
  for (const browserLang of browserLangs) {
    const browserLangLower = browserLang.toLowerCase();
    for (const localePath of sortedPaths) {
      const localeLang = locales[localePath]?.lang?.toLowerCase();
      if (localeLang && browserLangLower === localeLang) return localePath;
    }
  }

  // Second pass: lang-only match for all browser languages
  for (const browserLang of browserLangs) {
    const browserLangOnly = browserLang.split("-")[0].toLowerCase();
    for (const localePath of sortedPaths) {
      const localeLang = locales[localePath]?.lang?.toLowerCase();
      if (localeLang && browserLangOnly === localeLang) return localePath;
    }
  }

  return null;
};

export const getLocaleFromPath = (): string => {
  if (isSSR) return "/";

  const path = window.location.pathname;

  for (const localePath of sortedPaths) if (path.startsWith(localePath)) return localePath;

  return "/";
};
