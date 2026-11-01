import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import { App } from "./App.js";
import { localePaths } from "./config.js";
import { getBrowserLanguage, getStorage, isSSR, withBase } from "./utils/index.js";

const rootElement = document.querySelector("#root");

if (!rootElement) throw new Error("Could not find root element to mount to");

// Auto-redirect to the preferred language on the root path.
// An explicit choice made with the language switcher wins over the browser language.
if (!isSSR && window.location.pathname === withBase("/")) {
  const savedLocale = getStorage("locale");
  const matchedPath =
    savedLocale && localePaths.includes(savedLocale) ? savedLocale : getBrowserLanguage();

  if (matchedPath && matchedPath !== "/") window.location.replace(withBase(matchedPath));
}

if (import.meta.env.DEV) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
