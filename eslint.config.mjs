import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    "tests_verbose_output.txt",
    "scripts/**",
    "*.js",
    "*.mjs",
    "*.py",
    "*.html",
    "tests/**",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@next/next/no-img-element": "warn",
      "react/no-unescaped-entities": "warn",
      "prefer-const": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn"
    }
  }
]);

export default eslintConfig;
