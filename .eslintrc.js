const setAssetsImportRule = (patterns) => {
  return patterns.map((pattern) => ({
    pattern,
    patternOptions: {
      matchBase: true,
    },
    group: "object",
  }));
};

module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    parser: "babel-eslint",
  },
  extends: ["eslint:recommended", "prettier", "next/core-web-vitals"],
  rules: {
    "import/no-duplicates": "off",
    "import/order": [
      "error",
      {
        groups: [["builtin", "external"], ["internal", "parent", "sibling", "index"], ["object"]],
        pathGroups: [
          ...setAssetsImportRule([
            "*.svg",
            "*.svg?inline",
            "*.svg?url",
            "*.png",
            "*.jpg",
            "*.jpeg",
            "*.gif",
            "*.webp",
            "*.avif",
            "*.json",
            "*.md",
            "*.txt",
            "*.tif",
            "*.tiff",
            "*.woff",
            "*.woff2",
          ]),
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: false,
        },
      },
    ],
  },
  env: {
    browser: true,
    node: true,
  },
  overrides: [
    {
      files: "**/*.+(ts|tsx)",
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: ["@typescript-eslint/eslint-plugin"],
      extends: ["plugin:@typescript-eslint/eslint-recommended", "plugin:@typescript-eslint/recommended"],
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
      },
    },
  ],
};
