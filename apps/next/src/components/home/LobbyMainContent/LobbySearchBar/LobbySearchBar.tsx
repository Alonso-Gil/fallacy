"use client";

import { Search } from "lucide-react";
import React from "react";

import { cn } from "lib/utils";
import type { LobbySearchBarProps as Props } from "./LobbySearchBar.types";

const LobbySearchBar: React.FC<Props> = props => {
  const { className, label, placeholder, inputId } = props;

  return (
    <div
      className={cn(
        "group/search relative w-full min-w-0",
        "border-border/55 bg-surface rounded-lg border shadow-sm",
        "dark:border-border/50",
        "transition-[box-shadow,colors] duration-200",
        "focus-within:border-primary/45",
        "focus-within:shadow-primary/10 focus-within:shadow-md",
        className
      )}
    >
      <div className="flex h-10 w-full min-w-0 items-center gap-0.5 px-1.5 sm:px-2">
        <label
          className="text-muted-foreground/90 pointer-events-none flex shrink-0 p-1"
          htmlFor={inputId}
        >
          <Search className="size-4" strokeWidth={1.8} aria-hidden />
        </label>
        <input
          id={inputId}
          type="search"
          name="lobby-room-search"
          readOnly
          value=""
          className="text-foreground placeholder:text-muted-foreground h-10 w-full min-w-0 border-0 bg-transparent px-2.5 text-sm leading-none outline-none"
          placeholder={placeholder}
          aria-label={label}
        />
      </div>
    </div>
  );
};

export default LobbySearchBar;
