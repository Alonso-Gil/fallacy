import { builtinModules } from "node:module";

import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "**/eslint.config.mjs",
      "environments/*",
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**"
    ]
  },
  ...tseslint.configs.recommended,
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "simple-import-sort": simpleImportSort
    },
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
      "padding-line-between-statements": [
        "error",
        { blankLine: "never", prev: "directive", next: "import" }
      ],
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Node.js builtins
            ["^node:"],
            [`^(${builtinModules.join("|")})(/|$)`],

            // Paquetes externos
            ["^@?\\w"],

            // Aliases del monorepo
            ["^@fallacy/"],

            // Relativos
            ["^\\.", "^ui/", "^types/", "^components/", "^hooks/", "^config/", "^utils/", "^providers/", "^types/", "^store/", "^lib/", "^services/", "^i18n/", "^images/", "^globals\\.css$"],

            // Images
            ["^images/"],

            // Estilos
            ["^.+\\.s?css$"]
          ]
        }
      ]
    }
  }
);
