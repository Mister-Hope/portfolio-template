import type { Config } from "./types/index.js";

declare global {
  const __CONFIG__: Config;
}

export const { config = {}, locales } = __CONFIG__;

export const localePaths = Object.keys(locales);
