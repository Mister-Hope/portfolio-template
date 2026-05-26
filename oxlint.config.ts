import { defineHopeConfig } from "oxc-config-hope/oxlint";

export default defineHopeConfig(
  {
    node: ["lib/**/*.ts"],
    react: true,
    vitest: {
      bench: true,
    },

    rules: {
      // project settings
      "max-statements": ["warn", 30],
      "max-lines-per-function": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
      "no-underscore-dangle": ["warn", { allow: ["__CONFIG__", "__dirname", "__filename"] }],
      "react/forbid-component-props": [
        "warn",
        {
          forbid: [
            {
              propName: "className",
              allowedFor: ["AdaptiveImage", "Icon", "Iconify", "RichContent"],
              allowedForPatterns: ["**Tag"],
            },
            { propName: "style", allowedFor: ["Iconify"], allowedForPatterns: ["**Tag"] },
          ],
        },
      ],
      "unicorn/prefer-global-this": "off",
    },
  },
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
);
