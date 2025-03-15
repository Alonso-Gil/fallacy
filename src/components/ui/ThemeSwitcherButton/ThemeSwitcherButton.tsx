"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import { ThemeSwitcherButtonProps as Props } from "./ThemeSwitcherButton.types";

const ThemeSwitcher: React.FC<Props> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className={twMerge(
        className,
        "absolute bottom-4 right-4 rounded-xl bg-slate-200 px-10 py-2 duration-200 dark:bg-[#212933]",
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
};

export default ThemeSwitcher;
