import { createRequire } from "node:module";
import { bundleConfig, declarationsConfig } from "../../rollup.config.mjs";

const require = createRequire(import.meta.url);
const packageJSON = require("./package.json");

export default [
  bundleConfig(packageJSON, []),
  {
    ...declarationsConfig,
    external: [...declarationsConfig.external]
  }
];
