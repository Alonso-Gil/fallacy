import type {
  DebateFormat,
  OxfordFormatConfig,
  RoomBase,
  RoomStatus
} from "@fallacy/types";

export type RoomEntity = RoomBase;

export type CreateRoomPayload = Omit<
  RoomBase,
  "id" | "status" | "createdBy" | "createdAt" | "updatedAt" | "formatConfig"
> & { formatConfig?: OxfordFormatConfig | null };

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

export interface UpdateRoomPayload {
  title?: string;
  description?: string | null;
  motion?: string | null;
  maxSeats?: number;
  maxSeatsPerSide?: number;
  isPublic?: boolean;
  format?: DebateFormat;
  formatConfig?: OxfordFormatConfig | null;
  status?: RoomStatus;
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

export type { RoomBase };
