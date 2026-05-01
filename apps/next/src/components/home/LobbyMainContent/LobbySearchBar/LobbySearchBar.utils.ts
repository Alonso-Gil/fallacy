import type { RoomEntity } from "services/room/room.service.types";
import type {
  LobbyRoomFilters,
  LobbyRoomFormatFilter,
  LobbyRoomSeatFilter,
  LobbyRoomStatusFilter,
  LobbyRoomVisibilityFilter
} from "./LobbySearchBar.types";

export interface FilterLobbyRoomsParams extends LobbyRoomFilters {
  rooms: RoomEntity[];
  searchQuery: string;
}

export const defaultLobbyRoomFilters: LobbyRoomFilters = {
  statusFilter: "ALL",
  visibilityFilter: "ALL",
  formatFilter: "ALL",
  seatFilter: "ALL"
};

export const statusFilterOptions: readonly LobbyRoomStatusFilter[] = [
  "ALL",
  "WAITING",
  "IN_PROGRESS",
  "ENDED"
];

export const visibilityFilterOptions: readonly LobbyRoomVisibilityFilter[] = [
  "ALL",
  "PUBLIC",
  "PRIVATE"
];

export const formatFilterOptions: readonly LobbyRoomFormatFilter[] = [
  "ALL",
  "OXFORD",
  "FREE"
];

export const seatFilterOptions: readonly LobbyRoomSeatFilter[] = [
  "ALL",
  1,
  2,
  3
];

const normalizeSearchText = (value: string | null): string =>
  value?.trim().toLocaleLowerCase() ?? "";

const isRoomMatchingSearch = (
  room: RoomEntity,
  searchQuery: string
): boolean => {
  const normalizedSearchQuery = normalizeSearchText(searchQuery);
  if (!normalizedSearchQuery) {
    return true;
  }

  return [room.title, room.motion, room.description]
    .map(normalizeSearchText)
    .some(value => value.includes(normalizedSearchQuery));
};

export const isLobbyRoomFilterActive = (
  filters: LobbyRoomFilters,
  searchQuery: string
): boolean =>
  normalizeSearchText(searchQuery).length > 0 ||
  filters.statusFilter !== defaultLobbyRoomFilters.statusFilter ||
  filters.visibilityFilter !== defaultLobbyRoomFilters.visibilityFilter ||
  filters.formatFilter !== defaultLobbyRoomFilters.formatFilter ||
  filters.seatFilter !== defaultLobbyRoomFilters.seatFilter;

export const filterLobbyRooms = (
  params: FilterLobbyRoomsParams
): RoomEntity[] => {
  const {
    rooms,
    searchQuery,
    statusFilter,
    visibilityFilter,
    formatFilter,
    seatFilter
  } = params;

  return rooms.filter(room => {
    const isStatusMatch =
      statusFilter === "ALL" || room.status === statusFilter;
    const isVisibilityMatch =
      visibilityFilter === "ALL" ||
      (visibilityFilter === "PUBLIC" && room.isPublic) ||
      (visibilityFilter === "PRIVATE" && !room.isPublic);
    const isFormatMatch =
      formatFilter === "ALL" || room.format === formatFilter;
    const isSeatMatch =
      seatFilter === "ALL" ||
      (room.format === "OXFORD" && room.maxSeatsPerSide === seatFilter);

    return (
      isRoomMatchingSearch(room, searchQuery) &&
      isStatusMatch &&
      isVisibilityMatch &&
      isFormatMatch &&
      isSeatMatch
    );
  });
};
