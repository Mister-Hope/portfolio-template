import { config } from "oxc-config-hope/oxfmt";
import { defineConfig } from "oxfmt";

export default defineConfig({
  extends: config,
  sortTailwindcss: {
    stylesheet: "./src/index.css",
  },
});
