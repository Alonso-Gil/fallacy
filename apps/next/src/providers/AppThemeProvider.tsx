"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";

const g = globalThis as unknown as {
  __fallacyThemeScriptWarnFiltered?: boolean;
};

if (
  globalThis.window !== undefined &&
  process.env.NODE_ENV === "development" &&
  !g.__fallacyThemeScriptWarnFiltered
) {
  g.__fallacyThemeScriptWarnFiltered = true;
  const orig = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Encountered a script tag while rendering React component"
      )
    ) {
      return;
    }
    orig(...args);
  };
}

export const AppThemeProvider = (props: ThemeProviderProps) => (
  <ThemeProvider {...props} />
);
