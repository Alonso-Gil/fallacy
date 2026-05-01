import type { DebateFormat, RoomStatus } from "@fallacy/types";

import type { RoomEntity } from "services/room/room.service.types";

export type LobbyRoomStatusFilter = "ALL" | RoomStatus;
export type LobbyRoomVisibilityFilter = "ALL" | "PUBLIC" | "PRIVATE";
export type LobbyRoomFormatFilter =
  | "ALL"
  | Extract<DebateFormat, "OXFORD" | "FREE">;
export type LobbyRoomSeatFilter = "ALL" | 1 | 2 | 3;

export interface LobbyRoomFilters {
  statusFilter: LobbyRoomStatusFilter;
  visibilityFilter: LobbyRoomVisibilityFilter;
  formatFilter: LobbyRoomFormatFilter;
  seatFilter: LobbyRoomSeatFilter;
}

export type LobbySearchBarProps = {
  className?: string;
  label: string;
  placeholder: string;
  inputId: string;
  rooms: RoomEntity[];
  onFilteredRoomsChange: (
    filteredRooms: RoomEntity[],
    isFilterActive: boolean
  ) => void;
};
