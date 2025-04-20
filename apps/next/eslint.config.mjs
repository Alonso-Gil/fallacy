import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

import baseConfig from "../../eslint.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  ...baseConfig,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      // Desactiva el rule core de ESLint
      "no-unused-vars": "off",
      // Activa y personaliza la regla de TS para ignorar _args, _prev, _payload, etc.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/no-empty-object-type": "off"
    }
  }
);
