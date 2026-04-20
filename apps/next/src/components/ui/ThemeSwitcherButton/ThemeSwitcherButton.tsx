"use client";
import { useTheme } from "next-themes";
import React from "react";

import { useIsClient } from "hooks/useIsClient";
import { cn } from "lib/utils";
import { ThemeSwitcherButtonProps as Props } from "./ThemeSwitcherButton.types";

const ThemeSwitcher: React.FC<Props> = ({ className }) => {
  const isClient = useIsClient();
  const { theme, setTheme } = useTheme();

  if (!isClient) {
    return null;
  }

  return (
    <button
      className={cn(
        className,
        "cursor-pointer rounded-xl bg-slate-200 px-10 py-2 duration-200 dark:bg-[#212933]"
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
};

export default ThemeSwitcher;
