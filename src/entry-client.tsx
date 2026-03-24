import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import { App } from "./App.js";
import { getBrowserLanguage, isSSR } from "./utils/index.js";

const rootElement = document.querySelector("#root");

if (!rootElement) throw new Error("Could not find root element to mount to");

// Auto-redirect to preferred language on root path
if (!isSSR && window.location.pathname === "/") {
  const matchedPath = getBrowserLanguage();
  if (matchedPath && matchedPath !== "/") window.location.replace(matchedPath);
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
