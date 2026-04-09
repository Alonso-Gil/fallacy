import { builtinModules } from "module";
import { createRequire } from "module";

import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

const require = createRequire(import.meta.url);
/** @type {import("eslint").Linter.Config[]} */
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "coverage/**",
      "eslint.config.mjs"
    ]
  },
  ...nextCoreWebVitals,
  {
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^node:"],
            [`^(${builtinModules.join("|")})(/|$)`],
            ["^@?\\w"],
            ["^@fallacy/"],
            ["^\\.", "^ui/", "^types/", "^components/"],
            ["^images/"],
            ["^.+\\.s?css$"]
          ]
        }
      ]
    }
  },
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/ban-ts-ignore": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/no-empty-object-type": "off"
    }
  },
  {
    rules: {
      "no-unused-vars": "off"
    }
  }
);
