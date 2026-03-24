import { defaultIgnorePatterns, getOxlintConfigs } from "oxc-config-hope/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: getOxlintConfigs({
    node: ["lib/**/*.ts"],
    react: true,
    vitest: {
      bench: true,
    },
  }),
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: defaultIgnorePatterns,
  rules: {
    // project settings
    "max-statements": ["warn", 30],
    "max-lines-per-function": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
    "unicorn/prefer-global-this": "off",
  },
  overrides: [
    {
      files: ["config.example.ts", "config.example.js"],
      rules: {
        "max-lines": "off",
      },
    },
    {
      files: ["lib/**/*.ts"],
      rules: {
        // allow console usage in scripts and config files
        "no-console": "off",
      },
    },
  ],
});
