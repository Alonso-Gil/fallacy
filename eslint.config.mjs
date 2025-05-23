import { builtinModules } from "module";

import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: ["environments/*"]
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 5,
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        },
        parser: "@typescript-eslint/parser"
      }
    }
  },
  {
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
            ["^\\.", "^ui/", "^types/", "^components/"],

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
