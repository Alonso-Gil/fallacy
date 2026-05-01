import type { LobbyRoomFilters } from "../LobbySearchBar.types";

export type FilterTranslationKey = "status" | "visibility" | "format" | "seats";
export type FilterOptionValue = string | number;

export interface FilterSelectConfig {
  translationKey: FilterTranslationKey;
  value: string;
  options: readonly FilterOptionValue[];
  isDisabled?: boolean;
  onValueChange: (value: string) => void;
}

export interface LobbyFilterSelectorProps {
  searchQuery: string;
  onClearSearch: () => void;
  onFilterStateChange: (
    filters: LobbyRoomFilters,
    isFilterActive: boolean
  ) => void;
}
