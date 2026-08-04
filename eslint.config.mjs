import js from "@eslint/js";
import globals from "globals";
import markdown from "@eslint/markdown";

export default [
  { ignores: ["src/generated/**", "node_modules/**", "dist/**", "build.js", ".kilo/**", "eslint.config.mjs", "agentTools.js", "geminiAgent.js", "run-agent.js"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        vi: "readonly"
      }
    },
    rules: {
      "indent": ["error", 2],
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "no-undef": "error",
      "no-empty": "warn"
    }
  }
];
