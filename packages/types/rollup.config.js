import { declarationsConfig } from "../../rollup.config";

const config = [
  {
    ...declarationsConfig,
    external: [...declarationsConfig.external]
  }
];

export default config;
