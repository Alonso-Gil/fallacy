import type {
  CreateRoomPayload,
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
  return {
    id:
      overrides.id ??
      `mock-room-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`,
    title: payload?.title ?? overrides.title ?? "Sala mock",
    description: payload?.description ?? overrides.description ?? null,
    maxSeats: payload?.maxSeats ?? overrides.maxSeats ?? 4,
    isPublic: payload?.isPublic ?? overrides.isPublic ?? true,
    status: overrides.status ?? "WAITING",
    createdBy: overrides.createdBy ?? "mock-user",
    createdAt: overrides.createdAt ?? current,
    updatedAt: overrides.updatedAt ?? current
  };
};

const createInitialRoomMockState = (): RoomEntity[] => [
  buildMockRoom({
    id: "mock-room-1",
    title: "Debate abierto: IA en educación",
    description: "Impacto real en escuelas y universidades",
    maxSeats: 12,
    isPublic: true,
    status: "WAITING",
    createdBy: "mock-host-ana",
    createdAt: isoMinutesAgo(180),
    updatedAt: isoMinutesAgo(95)
  }),
  buildMockRoom({
    id: "mock-room-2",
    title: "Sala privada de moderadores",
    description: "Ajustes de reglas para torneo interno",
    maxSeats: 8,
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
    maxSeats: 4,
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
    maxSeats: 16,
    isPublic: false,
    status: "IN_PROGRESS",
    createdBy: "mock-host-diego",
    createdAt: isoMinutesAgo(75),
    updatedAt: isoMinutesAgo(5)
  }),
  buildMockRoom({
    id: "mock-room-5",
    title: "Debate sobre renta básica",
    description: "Conclusiones y votación final",
    maxSeats: 20,
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
    maxSeats: 32,
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
    maxSeats: 2,
    isPublic: true,
    status: "WAITING",
    createdBy: "mock-host-sara",
    createdAt: isoMinutesAgo(12),
    updatedAt: isoMinutesAgo(12)
  }),
  buildMockRoom({
    id: "mock-room-8",
    title: "Delfino es puto",
    description:
      "Delfino es putisimo, es un top y como todos los tops, es puto.",
    maxSeats: 64,
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
  const updated: RoomEntity = {
    ...(target ?? buildMockRoom({ id: roomId })),
    ...payload,
    updatedAt: nowIso()
  };
  roomMockState = roomMockState.map(room =>
    room.id === roomId ? updated : room
  );
  return updated;
};

export const getRoomByIdMock = (roomId: string): RoomEntity | undefined =>
  roomMockState.find(room => room.id === roomId);
