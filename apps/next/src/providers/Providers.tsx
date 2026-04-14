"use client";
import { ThemeProvider } from "next-themes";
import React from "react";

import ThemeSwitcherButton from "ui/ThemeSwitcherButton/ThemeSwitcherButton";
import useListeners from "hooks/useListeners";
import { ProvidersProps as Props } from "./Providers.types";

const Providers: React.FC<Props> = ({ children }) => {
  useListeners();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen w-screen">
        {children}
        <ThemeSwitcherButton />
      </div>
    </ThemeProvider>
  );
};

export default Providers;
