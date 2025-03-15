"use client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

import { ProvidersProps as Props } from "./Providers.types";
import useListeners from "hooks/useListeners";
import ThemeSwitcherButton from "ui/ThemeSwitcherButton/ThemeSwitcherButton";

const Providers: React.FC<Props> = ({ children }) => {
  useListeners();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextUIProvider className="h-screen w-screen">
        {children}
        <ThemeSwitcherButton />
      </NextUIProvider>
    </ThemeProvider>
  );
};

export default Providers;
