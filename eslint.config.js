import { hope } from "eslint-config-mister-hope";

export default hope({
  ignores: ["dist/**", "node_modules/**", "examples/config.example.js"],
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
});
