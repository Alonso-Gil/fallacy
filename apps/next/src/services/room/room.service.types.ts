import type { Room } from "@fallacy/types";

export type RoomEntity = Room;

export type RoomServiceErrorCode =
  | "API_NOT_CONFIGURED"
  | "HTTP_ERROR"
  | "INVALID_RESPONSE";

export class RoomServiceError extends Error {
  code: RoomServiceErrorCode;
  status?: number;

  constructor(message: string, code: RoomServiceErrorCode, status?: number) {
    super(message);
    this.name = "RoomServiceError";
    this.code = code;
    this.status = status;
  }
}

export interface CreateRoomPayload {
  title: string;
  description: string | null;
  maxSeats: number;
  isPublic: boolean;
}

export interface UpdateRoomPayload {
  title?: string;
  description?: string | null;
  maxSeats?: number;
  isPublic?: boolean;
}

export interface PostRoomVariables {
  accessToken: string;
  payload: CreateRoomPayload;
}

export interface PutRoomVariables {
  accessToken: string;
  roomId: string;
  payload: UpdateRoomPayload;
}

export interface UseFetchLobbyRoomsParams {
  isEnabled?: boolean;
}

export interface UseFetchRoomDetailParams {
  roomId: string;
  isEnabled?: boolean;
}

export interface PutRoomOptimisticContext {
  previousLobbyRooms?: RoomEntity[];
  previousDetail?: RoomEntity;
}
