import { builtinModules } from "module";
import { createRequire } from "module";

import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

const require = createRequire(import.meta.url);
/** @type {import("eslint").Linter.Config[]} */
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

/**
 * Imports locales (baseUrl ./src y alias internos). Deben ir después de terceros.
 * Ajustar si añades nuevos alias en tsconfig paths.
 */
const localPathPrefixes =
  "^(?!ui/)(?!components/)(?!hooks/)(?!config/)(?!utils/)(?!providers/)(?!types/)(?!store/)(?!lib/)(?!images/)(?!globals\\.css$)";

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
            // 1) Side effects
            ["^\\u0000"],
            // 2) Node builtins
            ["^node:"],
            [`^(${builtinModules.join("|")})(/|$)`],
            // 3) Terceros (un solo grupo: @scope/pkg y paquetes sin scope; si se parte en dos, ESLint inserta línea en blanco entre ellos)
            ["^@(?!/).+", `${localPathPrefixes}[\\w@][\\w./@-]*$`],
            // 4) Locales (alias src + relativos .ts/.tsx; excluye .css para el grupo de estilos)
            [
              "^ui/",
              "^components/",
              "^hooks/",
              "^config/",
              "^utils/",
              "^lib/",
              "^providers/",
              "^types/",
              "^store/",
              "^\\.\\.(?!.*\\.(?:css|scss|sass|less)$)(?!/?$)",
              "^\\./(?!.*\\.(?:css|scss|sass|less)$)"
            ],
            // 5) Alias images (public)
            ["^images/"],
            // 6) Estilos (después de locales; incluye ../globals.css)
            ["^.+\\.(?:css|scss|sass|less)$"]
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
