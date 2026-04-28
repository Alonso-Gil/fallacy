import {
  type DebateFormat,
  getDefaultOxfordFormatConfig
} from "@fallacy/types";

import { applyRoomUpdate } from "services/room/room.service.utils";
import type {
  CreateRoomPayload,
  RoomBase,
  RoomEntity,
  UpdateRoomPayload
} from "./room.service.types";

const nowIso = (): string => new Date().toISOString();
const isoMinutesAgo = (minutesAgo: number): string =>
  new Date(Date.now() - minutesAgo * 60_000).toISOString();

const buildMockRoom = (
  overrides: Partial<RoomEntity> = {},
  payload?: CreateRoomPayload
): RoomEntity => {
  const current = nowIso();
  const format: DebateFormat = payload?.format ?? overrides.format ?? "OXFORD";
  const base: Pick<
    RoomEntity,
    | "id"
    | "title"
    | "motion"
    | "description"
    | "maxSeatsPerSide"
    | "isPublic"
    | "status"
    | "createdBy"
    | "createdAt"
    | "updatedAt"
  > = {
    id:
      overrides.id ??
      `mock-room-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`,
    title: payload?.title ?? overrides.title ?? "Sala mock",
    motion: payload?.motion ?? overrides.motion ?? null,
    description: payload?.description ?? overrides.description ?? null,
    maxSeatsPerSide: payload?.maxSeatsPerSide ?? overrides.maxSeatsPerSide ?? 2,
    isPublic: payload?.isPublic ?? overrides.isPublic ?? true,
    status: (overrides.status ?? "WAITING") as RoomBase["status"],
    createdBy: overrides.createdBy ?? "mock-user",
    createdAt: overrides.createdAt ?? current,
    updatedAt: overrides.updatedAt ?? current
  };
  const formatConfig =
    format === "OXFORD"
      ? (overrides.formatConfig ??
        payload?.formatConfig ??
        getDefaultOxfordFormatConfig())
      : (overrides.formatConfig ?? null);
  return {
    ...base,
    format,
    formatConfig
  };
};

const createInitialRoomMockState = (): RoomEntity[] => [
  buildMockRoom({
    id: "mock-room-1",
    title: "Debate abierto: IA en educación",
    motion:
      "Esta casa cree que la inteligencia artificial debería integrarse formalmente en escuelas y universidades.",
    description: "Impacto real en escuelas y universidades",
    maxSeatsPerSide: 2,
    isPublic: true,
    status: "WAITING",
    format: "OXFORD",
    createdBy: "mock-host-ana",
    createdAt: isoMinutesAgo(180),
    updatedAt: isoMinutesAgo(95)
  }),
  buildMockRoom({
    id: "mock-room-2",
    title: "Sala privada de moderadores",
    description: "Ajustes de reglas para torneo interno",
    format: "FREE",
    motion: null,
    maxSeatsPerSide: 2,
    isPublic: false,
    status: "WAITING",
    createdBy: "mock-host-carlos",
    createdAt: isoMinutesAgo(150),
    updatedAt: isoMinutesAgo(120)
  }),
  buildMockRoom({
    id: "mock-room-3",
    title: "Ensayo de apertura",
    description: "Práctica de argumentos iniciales",
    maxSeatsPerSide: 2,
    isPublic: true,
    status: "IN_PROGRESS",
    createdBy: "mock-host-lucy",
    createdAt: isoMinutesAgo(90),
    updatedAt: isoMinutesAgo(20)
  }),
  buildMockRoom({
    id: "mock-room-4",
    title: "Final regional",
    description: "Ronda cerrada de semifinalistas",
    maxSeatsPerSide: 3,
    isPublic: false,
    status: "IN_PROGRESS",
    format: "OXFORD",
    createdBy: "mock-host-diego",
    createdAt: isoMinutesAgo(75),
    updatedAt: isoMinutesAgo(5)
  }),
  buildMockRoom({
    id: "mock-room-5",
    title: "Debate sobre renta básica",
    description: "Conclusiones y votación final",
    maxSeatsPerSide: 2,
    isPublic: true,
    status: "ENDED",
    createdBy: "mock-host-irene",
    createdAt: isoMinutesAgo(320),
    updatedAt: isoMinutesAgo(40)
  }),
  buildMockRoom({
    id: "mock-room-6",
    title: "Club de novatos",
    description: "Introducción a falacias comunes",
    maxSeatsPerSide: 2,
    isPublic: true,
    status: "WAITING",
    createdBy: "mock-host-marco",
    createdAt: isoMinutesAgo(45),
    updatedAt: isoMinutesAgo(45)
  }),
  buildMockRoom({
    id: "mock-room-7",
    title: "Debate relámpago",
    description: null,
    maxSeatsPerSide: 1,
    isPublic: true,
    status: "WAITING",
    format: "OXFORD",
    createdBy: "mock-host-sara",
    createdAt: isoMinutesAgo(12),
    updatedAt: isoMinutesAgo(12)
  }),
  buildMockRoom({
    id: "mock-room-8",
    title: "Sala de prueba 8",
    description: "Datos de ejemplo",
    maxSeatsPerSide: 2,
    isPublic: true,
    status: "ENDED",
    createdBy: "mock-host-admin",
    createdAt: isoMinutesAgo(980),
    updatedAt: isoMinutesAgo(260)
  })
];

let roomMockState: RoomEntity[] = createInitialRoomMockState();

export const resetRoomMockState = (): RoomEntity[] => {
  roomMockState = createInitialRoomMockState();
  return [...roomMockState];
};

export const getRoomMockState = (): RoomEntity[] => [...roomMockState];

export const createRoomMock = (payload: CreateRoomPayload): RoomEntity => {
  const created = buildMockRoom({}, payload);
  roomMockState = [created, ...roomMockState];
  return created;
};

export const updateRoomMock = (
  roomId: string,
  payload: UpdateRoomPayload
): RoomEntity => {
  const target = roomMockState.find(room => room.id === roomId);
  if (!target) {
    const fallback = buildMockRoom({ id: roomId });
    return applyRoomUpdate(fallback, payload);
  }
  const updated = applyRoomUpdate(target, payload);
  roomMockState = roomMockState.map(room =>
    room.id === roomId ? updated : room
  );
  return updated;
};

export const getRoomByIdMock = (roomId: string): RoomEntity | undefined =>
  roomMockState.find(room => room.id === roomId);
