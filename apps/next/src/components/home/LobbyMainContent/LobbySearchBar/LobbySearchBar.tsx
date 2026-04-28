"use client";
import { Search } from "lucide-react";
import React from "react";

import { cn } from "lib/utils";
import type { LobbySearchBarProps as Props } from "./LobbySearchBar.types";

const LobbySearchBar: React.FC<Props> = props => {
  const { className, label, placeholder, inputId } = props;

  return (
    <div className={cn("group/search relative w-full min-w-0", className)}>
      <label
        htmlFor={inputId}
        className="text-muted-foreground group-focus-within/search:text-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 transition-colors duration-200 dark:text-white/50"
      >
        <Search className="size-4" strokeWidth={1.8} aria-hidden />
      </label>
      <input
        id={inputId}
        type="search"
        name="lobby-room-search"
        readOnly
        value=""
        placeholder={placeholder}
        aria-label={label}
        className={cn(
          "border-border/55 bg-foreground/4 text-foreground placeholder:text-muted-foreground h-11 w-full min-w-0 rounded-xl border px-11 text-sm leading-none transition-all duration-200 outline-none",
          "hover:border-border hover:bg-foreground/6",
          "focus:border-primary/50 focus:bg-foreground/6 focus:ring-primary/10 focus:ring-2",
          "dark:border-white/10 dark:bg-white/4 dark:placeholder:text-white/45",
          "dark:hover:border-white/15 dark:hover:bg-white/6",
          "dark:focus:border-orange-500/50 dark:focus:bg-white/6 dark:focus:ring-orange-500/10"
        )}
      />
    </div>
  );
};

export default LobbySearchBar;
