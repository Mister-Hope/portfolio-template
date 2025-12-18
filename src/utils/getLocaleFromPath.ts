import { localePaths } from "../config.js";

const sortedPaths = [...localePaths].sort((a, b) => b.length - a.length);

export const getLocaleFromPath = (): string => {
  if (typeof window === "undefined") return "/";

  const path = window.location.pathname;

  for (const localePath of sortedPaths) {
    if (path.startsWith(localePath)) return localePath;
  }

  return "/";
};
