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
  extends: "next/core-web-vitals",
  rules: {
    "import/no-duplicates": "off",
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
          ["internal", "parent", "sibling", "index"],
          ["object"],
        ],
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
};
