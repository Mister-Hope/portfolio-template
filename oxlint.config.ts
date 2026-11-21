import { defineHopeConfig } from "oxc-config-hope/oxlint";

export default defineHopeConfig(
  {
    node: ["lib/**/*.ts"],
    react: true,
    vitest: {
      bench: true,
    },

    rules: {
      "max-statements": ["warn", 30],
      "max-lines-per-function": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
      "no-underscore-dangle": [
        "warn",
        { allow: ["__BUILD_YEAR__", "__CONFIG__", "__dirname", "__filename"] },
      ],
      "node/no-sync": "off",
      "react/function-component-definition": ["warn", { namedComponents: ["arrow-function"] }],
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
  {
    // `.github/scripts/**` is the fork-sync CLI: dependency-free ESM executed by
    // `node` straight from a workflow checkout, so app-oriented rules such as
    // jsdoc tags, complexity budgets and single-call chaining do not apply.
    files: [".github/scripts/**/*.mjs"],
    rules: {
      complexity: "off",
      curly: "off",
      "import/no-nodejs-modules": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-returns-description": "off",
      "max-lines": "off",
      "max-statements": "off",
      "no-undefined": "off",
      "one-var": "off",
      "react/function-component-definition": "off",
      "unicorn/catch-error-name": "off",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/prefer-number-coercion": "off",
      "unicorn/prefer-single-call": "off",
    },
  },
);
