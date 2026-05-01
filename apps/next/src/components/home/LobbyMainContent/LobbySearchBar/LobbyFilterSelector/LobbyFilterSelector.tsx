"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";

import Button from "ui/Button/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "ui/shadcnComponents/select";
import type {
  LobbyRoomFilters,
  LobbyRoomFormatFilter,
  LobbyRoomSeatFilter,
  LobbyRoomStatusFilter,
  LobbyRoomVisibilityFilter
} from "../LobbySearchBar.types";
import {
  defaultLobbyRoomFilters,
  formatFilterOptions,
  isLobbyRoomFilterActive,
  seatFilterOptions,
  statusFilterOptions,
  visibilityFilterOptions
} from "../LobbySearchBar.utils";
import type {
  FilterSelectConfig,
  LobbyFilterSelectorProps
} from "./LobbyFilterSelector.types";

const LobbyFilterSelector: React.FC<LobbyFilterSelectorProps> = props => {
  const { searchQuery, onClearSearch, onFilterStateChange } = props;
  const t = useTranslations("Lobby");
  const [filters, setFilters] = useState<LobbyRoomFilters>(
    defaultLobbyRoomFilters
  );
  const isFilterActive = isLobbyRoomFilterActive(filters, searchQuery);
  const isSeatFilterDisabled = filters.formatFilter === "FREE";

  const handleClearFilters = () => {
    onClearSearch();
    setFilters(defaultLobbyRoomFilters);
  };

  const updateFilter = <Key extends keyof LobbyRoomFilters>(
    key: Key,
    value: LobbyRoomFilters[Key]
  ) => {
    setFilters(currentFilters => ({
      ...currentFilters,
      [key]: value
    }));
  };

  const handleFormatFilterChange = (
    nextFormatFilter: LobbyRoomFormatFilter
  ) => {
    setFilters(currentFilters => ({
      ...currentFilters,
      formatFilter: nextFormatFilter,
      seatFilter:
        nextFormatFilter === "FREE"
          ? defaultLobbyRoomFilters.seatFilter
          : currentFilters.seatFilter
    }));
  };

  const filterSelects = useMemo(
    () =>
      [
        {
          translationKey: "status",
          value: filters.statusFilter,
          options: statusFilterOptions,
          onValueChange: value =>
            updateFilter("statusFilter", value as LobbyRoomStatusFilter)
        },
        {
          translationKey: "visibility",
          value: filters.visibilityFilter,
          options: visibilityFilterOptions,
          onValueChange: value =>
            updateFilter("visibilityFilter", value as LobbyRoomVisibilityFilter)
        },
        {
          translationKey: "format",
          value: filters.formatFilter,
          options: formatFilterOptions,
          onValueChange: value =>
            handleFormatFilterChange(value as LobbyRoomFormatFilter)
        },
        {
          translationKey: "seats",
          value: String(filters.seatFilter),
          options: seatFilterOptions,
          isDisabled: isSeatFilterDisabled,
          onValueChange: value =>
            updateFilter(
              "seatFilter",
              value === "ALL" ? "ALL" : (Number(value) as LobbyRoomSeatFilter)
            )
        }
      ] satisfies FilterSelectConfig[],
    [filters, isSeatFilterDisabled]
  );

  useEffect(() => {
    onFilterStateChange(filters, isFilterActive);
  }, [filters, isFilterActive, onFilterStateChange]);

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
      {filterSelects.map(filter => {
        const ariaLabel = t(`room.filters.${filter.translationKey}.ariaLabel`);
        const label = t(`room.filters.${filter.translationKey}.shortLabel`);
        const selectedLabel = t(
          `room.filters.${filter.translationKey}.options.${filter.value}`
        );

        return (
          <Select
            key={filter.translationKey}
            value={filter.value}
            onValueChange={nextValue => {
              if (nextValue) {
                filter.onValueChange(nextValue);
              }
            }}
            disabled={filter.isDisabled}
          >
            <SelectTrigger
              size="sm"
              aria-label={ariaLabel}
              className="disabled:text-muted-foreground/60 h-8 w-full gap-1.5 text-xs sm:w-auto"
            >
              <SelectValue>
                {() => (
                  <>
                    <span className="text-muted-foreground">{`${label}:`}</span>
                    <span className="text-foreground font-medium">
                      {selectedLabel}
                    </span>
                  </>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              alignItemWithTrigger={false}
              align="start"
              sideOffset={6}
            >
              {filter.options.map(option => {
                const value = String(option);

                return (
                  <SelectItem
                    key={value}
                    value={value}
                    className="focus:bg-surface-secondary focus:text-text p-2"
                  >
                    {t(
                      `room.filters.${filter.translationKey}.options.${value}`
                    )}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );
      })}
      {isFilterActive ? (
        <Button
          type="button"
          variant="ghost"
          text={t("room.actions.clearFilters")}
          onClick={handleClearFilters}
          className="text-muted-foreground hover:text-foreground h-8 w-full bg-transparent px-2 text-xs sm:w-auto"
        />
      ) : null}
    </div>
  );
};

export default LobbyFilterSelector;
