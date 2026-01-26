import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import { App } from "./App.js";

const rootElement = document.querySelector("#root");

if (!rootElement) throw new Error("Could not find root element to mount to");

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
