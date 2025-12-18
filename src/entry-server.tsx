import { renderToString } from "react-dom/server";
import { App } from "./App.js";
import type { Config } from "./types/index.js";

export function render(url: string, config: Config): string {
  const { locales } = config;
  const localePaths = Object.keys(locales);

  let locale = "/";
  const sortedPaths = [...localePaths].sort((a, b) => b.length - a.length);

  for (const localePath of sortedPaths) {
    if (localePath === "/") continue;
    if (url.startsWith(localePath)) {
      locale = localePath;
      break;
    }
  }

  return renderToString(<App initialLocale={locale} />);
}
