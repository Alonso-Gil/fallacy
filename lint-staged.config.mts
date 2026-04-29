import type { Configuration } from "lint-staged";

const quoteArg = (f: string): string => JSON.stringify(f);

const relInside = (files: readonly string[], prefix: string): string[] =>
  files.map(f => f.replace(new RegExp(`^${prefix}/`), ""));

const config: Configuration = {
  "apps/next/**/*.{ts,tsx}": (files): string | string[] => {
    if (files.length === 0) {
      return [];
    }
    const rel = relInside(files, "apps/next");
    return `yarn --cwd apps/next eslint --fix --max-warnings 0 ${rel.map(quoteArg).join(" ")}`;
  },
  "apps/nest/**/*.ts": (files): string | string[] => {
    if (files.length === 0) {
      return [];
    }
    const rel = relInside(files, "apps/nest");
    return `yarn --cwd apps/nest eslint --fix --max-warnings 0 ${rel.map(quoteArg).join(" ")}`;
  },
  "apps/expo/**/*.{ts,tsx}": (files): string | string[] => {
    if (files.length === 0) {
      return [];
    }
    const rel = relInside(files, "apps/expo");
    return `yarn --cwd apps/expo eslint --fix --max-warnings 0 ${rel.map(quoteArg).join(" ")}`;
  },
  "packages/types/**/*.{ts,tsx}": (files): string | string[] => {
    if (files.length === 0) {
      return [];
    }
    const rel = relInside(files, "packages/types");
    return `yarn --cwd packages/types eslint --fix --max-warnings 0 ${rel.map(quoteArg).join(" ")}`;
  },
  "**/*.{json,md,yml,yaml}": (files): string | string[] => {
    if (files.length === 0) {
      return [];
    }
    return `prettier --write ${files.map(quoteArg).join(" ")}`;
  }
};

export default config;
