"use client";
import { useTheme } from "next-themes";
import React, { useSyncExternalStore } from "react";
import { twMerge } from "tailwind-merge";

import { ThemeSwitcherButtonProps as Props } from "./ThemeSwitcherButton.types";

const emptySubscribe = () => () => {};

const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

const ThemeSwitcher: React.FC<Props> = ({ className }) => {
  const isClient = useIsClient();
  const { theme, setTheme } = useTheme();

  if (!isClient) {
    return null;
  }

  return (
    <button
      className={twMerge(
        className,
        "absolute right-4 bottom-4 rounded-xl bg-slate-200 px-10 py-2 duration-200 dark:bg-[#212933]"
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
};

export default ThemeSwitcher;
