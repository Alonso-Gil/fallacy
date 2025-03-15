"use client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

import { ProvidersProps as Props } from "./Providers.types";

import ThemeSwitcherButton from "@/components/ui/ThemeSwitcherButton/ThemeSwitcherButton";
import useListeners from "@/hooks/useListeners";

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
