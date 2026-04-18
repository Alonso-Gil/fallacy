"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";

export const AppThemeProvider = (props: ThemeProviderProps) => (
  <ThemeProvider {...props} />
);
