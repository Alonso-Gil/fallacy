import type { RoomEntity, RoomServiceErrorCode } from "./room.service.types";
import { RoomServiceError } from "./room.service.types";

export const parseRoom = (data: unknown): RoomEntity => {
  if (!data || typeof data !== "object") {
    throw new RoomServiceError("Invalid room response", "INVALID_RESPONSE");
  }
  return data as RoomEntity;
};

export const toRoomServiceError = (
  code: RoomServiceErrorCode,
  status?: number
): RoomServiceError =>
  new RoomServiceError("Room request failed", code, status);

export const isRoomApiConfigured = (
  isMockEnabled: boolean,
  baseUrl: string | null
): boolean => isMockEnabled || baseUrl !== null;
