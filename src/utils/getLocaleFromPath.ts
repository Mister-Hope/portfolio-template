import { localePaths } from "../config.js";
import { isSSR } from "./isSSR.js";

const sortedPaths = [...localePaths].sort((a, b) => b.length - a.length);

export const getLocaleFromPath = (): string => {
  if (isSSR) return "/";

  const path = window.location.pathname;

  for (const localePath of sortedPaths) if (path.startsWith(localePath)) return localePath;

  return "/";
};
