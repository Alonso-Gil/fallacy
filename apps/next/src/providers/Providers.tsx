"use client";
import React from "react";

import LocaleSwitcherButton from "ui/LocaleSwitcherButton/LocaleSwitcherButton";
import ThemeSwitcherButton from "ui/ThemeSwitcherButton/ThemeSwitcherButton";
import useListeners from "hooks/useListeners";
import { AppThemeProvider } from "providers/AppThemeProvider";
import { ProvidersProps as Props } from "./Providers.types";

const Providers: React.FC<Props> = ({ children }) => {
  useListeners();

  return (
    <AppThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen w-screen">
        {children}
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          <LocaleSwitcherButton />
          <ThemeSwitcherButton />
        </div>
      </div>
    </AppThemeProvider>
  );
};

export default Providers;
