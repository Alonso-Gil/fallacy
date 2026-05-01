"use client";
import { Search } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "lib/utils";
import CreateRoomDialog from "../CreateRoomDialog/CreateRoomDialog";
import LobbyFilterSelector from "./LobbyFilterSelector/LobbyFilterSelector";
import type { LobbySearchBarProps as Props } from "./LobbySearchBar.types";
import type { LobbyRoomFilters } from "./LobbySearchBar.types";
import {
  defaultLobbyRoomFilters,
  filterLobbyRooms
} from "./LobbySearchBar.utils";

const LobbySearchBar: React.FC<Props> = props => {
  const {
    className,
    label,
    placeholder,
    inputId,
    rooms,
    onFilteredRoomsChange
  } = props;
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<LobbyRoomFilters>(
    defaultLobbyRoomFilters
  );
  const [isFilterActive, setIsFilterActive] = useState(false);
  const filteredRooms = useMemo(
    () =>
      filterLobbyRooms({
        rooms,
        searchQuery,
        ...filters
      }),
    [filters, rooms, searchQuery]
  );

  useEffect(() => {
    onFilteredRoomsChange(filteredRooms, isFilterActive);
  }, [filteredRooms, isFilterActive, onFilteredRoomsChange]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleFilterStateChange = useCallback(
    (nextFilters: LobbyRoomFilters, nextIsFilterActive: boolean) => {
      setFilters(nextFilters);
      setIsFilterActive(nextIsFilterActive);
    },
    []
  );

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)}>
      <div className="flex w-full flex-row gap-2">
        <div className="group/search relative w-full min-w-0 sm:max-w-[640px]">
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
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
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
        <CreateRoomDialog className="shadow-primary/15 hover:shadow-primary/25 h-11 w-full rounded-xl px-5 text-sm font-semibold shadow-lg transition-all sm:w-auto sm:min-w-32" />
      </div>
      <LobbyFilterSelector
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
        onFilterStateChange={handleFilterStateChange}
      />
    </div>
  );
};

export default LobbySearchBar;
