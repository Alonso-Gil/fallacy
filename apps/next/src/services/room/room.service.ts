import {
  buildAuthHeaders,
  getBaseUrlFromEnv,
  shouldMockByFlag,
  waitForMockLatency
} from "utils/common.utils";
import {
  createRoomMock,
  getRoomByIdMock,
  getRoomMockState,
  updateRoomMock
} from "./room.service.mock";
import type {
  CreateRoomPayload,
  RoomEntity,
  UpdateRoomPayload
} from "./room.service.types";
import {
  isRoomApiConfigured as getIsRoomApiConfigured,
  parseRoom,
  toRoomServiceError
} from "./room.service.utils";

const ROOM_MOCK_LATENCY_MS = 220;
const isMockEnabled = shouldMockByFlag(
  process.env.NEXT_PUBLIC_ROOM_SHOULD_MOCK
);
const baseUrl = getBaseUrlFromEnv(process.env.NEXT_PUBLIC_API_URL);

export const isRoomApiConfigured = (): boolean =>
  getIsRoomApiConfigured(isMockEnabled, baseUrl);

export const fetchLobbyRooms = async (): Promise<RoomEntity[]> => {
  if (isMockEnabled) {
    await waitForMockLatency(ROOM_MOCK_LATENCY_MS);
    return getRoomMockState();
  }

  if (!baseUrl) {
    throw toRoomServiceError("API_NOT_CONFIGURED");
  }

  const response = await fetch(`${baseUrl}/room/lobby`, { cache: "no-store" });
  if (!response.ok) {
    throw toRoomServiceError("HTTP_ERROR", response.status);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw toRoomServiceError("INVALID_RESPONSE");
  }
  return payload as RoomEntity[];
};

export const fetchLobbyRoomDetail = async (
  roomId: string
): Promise<RoomEntity> => {
  if (isMockEnabled) {
    await waitForMockLatency(ROOM_MOCK_LATENCY_MS);
    const room = getRoomByIdMock(roomId);
    if (!room) {
      throw toRoomServiceError("HTTP_ERROR", 404);
    }
    return room;
  }

  if (!baseUrl) {
    throw toRoomServiceError("API_NOT_CONFIGURED");
  }

  const response = await fetch(`${baseUrl}/room/lobby/${roomId}`, {
    cache: "no-store"
  });
  if (!response.ok) {
    throw toRoomServiceError("HTTP_ERROR", response.status);
  }

  return parseRoom(await response.json());
};

export const postRoom = async (
  accessToken: string,
  payload: CreateRoomPayload
): Promise<RoomEntity> => {
  if (isMockEnabled) {
    await waitForMockLatency(ROOM_MOCK_LATENCY_MS);
    return createRoomMock(payload);
  }

  if (!baseUrl) {
    throw toRoomServiceError("API_NOT_CONFIGURED");
  }

  const response = await fetch(`${baseUrl}/room`, {
    method: "POST",
    cache: "no-store",
    headers: buildAuthHeaders(accessToken),
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw toRoomServiceError("HTTP_ERROR", response.status);
  }

  return parseRoom(await response.json());
};

export const putRoom = async (
  accessToken: string,
  roomId: string,
  payload: UpdateRoomPayload
): Promise<RoomEntity> => {
  if (isMockEnabled) {
    await waitForMockLatency(ROOM_MOCK_LATENCY_MS);
    return updateRoomMock(roomId, payload);
  }

  if (!baseUrl) {
    throw toRoomServiceError("API_NOT_CONFIGURED");
  }

  const response = await fetch(`${baseUrl}/room/${roomId}`, {
    method: "PATCH",
    cache: "no-store",
    headers: buildAuthHeaders(accessToken),
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw toRoomServiceError("HTTP_ERROR", response.status);
  }

  return parseRoom(await response.json());
};
