"use client";
import { ThemeProvider, type ThemeProviderProps } from "next-themes";

// TODO: remove when next-themes stops injecting <script> at runtime and
// React 19 no longer emits this warning. See: https://github.com/pacocoursey/next-themes
const NEXT_THEMES_SCRIPT_WARNING =
  "Encountered a script tag while rendering React component";

const globalScope = globalThis as typeof globalThis & {
  __nextThemesWarningSilenced?: boolean;
};

const silenceNextThemesScriptWarning = () => {
  const isBrowser = globalThis.window !== undefined;
  const isDevelopment = process.env.NODE_ENV === "development";
  const alreadySilenced = globalScope.__nextThemesWarningSilenced === true;

  if (!isBrowser || !isDevelopment || alreadySilenced) return;

  globalScope.__nextThemesWarningSilenced = true;
  const originalConsoleError = console.error.bind(console);

  console.error = (...args: unknown[]) => {
    const [firstArg] = args;
    const isTargetWarning =
      typeof firstArg === "string" &&
      firstArg.includes(NEXT_THEMES_SCRIPT_WARNING);

    if (isTargetWarning) return;
    originalConsoleError(...args);
  };
};

silenceNextThemesScriptWarning();

export const AppThemeProvider = (props: ThemeProviderProps) => (
  <ThemeProvider {...props} />
);
