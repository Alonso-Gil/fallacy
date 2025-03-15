const path = require("path");

const config = require("../../.eslintrc");

module.exports = {
  ...config,
  extends: ["eslint:recommended", "react-app", "prettier"],
  overrides: [
    {
      ...config.overrides[0],
      settings: {
        "import/resolver": {
          node: {
            paths: [path.resolve(__dirname, "src")]
          },
          typescript: {
            project: path.resolve(__dirname, "tsconfig.json")
          }
        }
      }
    }
  ]
};
