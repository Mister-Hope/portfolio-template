import { defineConfig } from "vitest/config";

// Keep Vitest independent from `vite.config.ts`: the app config requires a user `config.*` file,
// while the build tests create and clean those files themselves.
export default defineConfig({
  test: {
    include: ["tests/**/*.spec.ts"],
    testTimeout: 240_000,
    hookTimeout: 240_000,
  },
});
