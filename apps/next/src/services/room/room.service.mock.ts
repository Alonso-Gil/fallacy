import {
  type DebateFormat,
  getDefaultOxfordFormatConfig,
  type OxfordFormatConfig
} from "@fallacy/types";

import { applyRoomUpdate } from "services/room/room.service.utils";
import type {
  CreateRoomPayload,
  RoomEntity,
  UpdateRoomPayload
} from "./room.service.types";

const nowIso = (): string => new Date().toISOString();
const isoMinutesAgo = (minutesAgo: number): string =>
  new Date(Date.now() - minutesAgo * 60_000).toISOString();

const buildOxfordFormatConfigAtPhase = (
  currentPhaseIndex: number
): OxfordFormatConfig => {
  const base = getDefaultOxfordFormatConfig();
  const lastPhaseIndex = base.debatePhases.length - 1;
  const safePhaseIndex = Math.min(
    lastPhaseIndex,
    Math.max(0, Math.trunc(currentPhaseIndex))
  );
  const currentPhase = base.debatePhases[safePhaseIndex] ?? base.currentPhase;

  return {
    ...base,
    currentPhaseIndex: safePhaseIndex,
    currentPhase,
    phaseStartedAt: isoMinutesAgo((lastPhaseIndex - safePhaseIndex + 1) * 8)
  };
};

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
    status: overrides.status ?? "WAITING",
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
    title: "IA en educación",
    motion:
      "Esta casa cree que la inteligencia artificial debería integrarse formalmente en escuelas y universidades públicas.",
    description:
      "Discusión abierta sobre aprendizaje personalizado, sesgos algorítmicos y el rol docente.",
    maxSeatsPerSide: 2,
    isPublic: true,
    status: "WAITING",
    format: "OXFORD",
    formatConfig: buildOxfordFormatConfigAtPhase(0),
    createdBy: "mock-host-ana",
    createdAt: isoMinutesAgo(180),
    updatedAt: isoMinutesAgo(95)
  }),
  buildMockRoom({
    id: "mock-room-2",
    title: "Torneo interno de moderadores",
    description:
      "Sala privada para revisar criterios de moderación antes de las rondas oficiales.",
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
    title: "Redes sociales y salud mental adolescente",
    motion:
      "Esta casa prohibiría a menores de 16 años crear cuentas en redes sociales sin autorización verificable de sus tutores.",
    description:
      "Práctica de aperturas con una moción larga para probar el truncado visual de la card.",
    maxSeatsPerSide: 2,
    isPublic: true,
    status: "IN_PROGRESS",
    format: "OXFORD",
    formatConfig: buildOxfordFormatConfigAtPhase(4),
    createdBy: "mock-host-lucy",
    createdAt: isoMinutesAgo(90),
    updatedAt: isoMinutesAgo(20)
  }),
  buildMockRoom({
    id: "mock-room-4",
    title: "Semifinal regional: privacidad vs seguridad pública",
    motion:
      "Esta casa priorizaría la privacidad ciudadana sobre herramientas estatales de vigilancia masiva incluso ante amenazas de seguridad pública.",
    description: "Ronda cerrada de semifinalistas con jueces invitados.",
    maxSeatsPerSide: 3,
    isPublic: false,
    status: "IN_PROGRESS",
    format: "OXFORD",
    formatConfig: buildOxfordFormatConfigAtPhase(7),
    createdBy: "mock-host-diego",
    createdAt: isoMinutesAgo(75),
    updatedAt: isoMinutesAgo(5)
  }),
  buildMockRoom({
    id: "mock-room-5",
    title: "Renta básica universal",
    motion:
      "Esta casa implementaría una renta básica universal como respuesta a la automatización del trabajo.",
    description: "Debate finalizado con resultados listos para revisión.",
    maxSeatsPerSide: 2,
    isPublic: true,
    status: "ENDED",
    format: "OXFORD",
    formatConfig: buildOxfordFormatConfigAtPhase(9),
    createdBy: "mock-host-irene",
    createdAt: isoMinutesAgo(320),
    updatedAt: isoMinutesAgo(40)
  }),
  buildMockRoom({
    id: "mock-room-6",
    title: "Club de novatos",
    description:
      "Introducción a falacias comunes y práctica sin formato rígido.",
    format: "FREE",
    motion: null,
    maxSeatsPerSide: 1,
    isPublic: true,
    status: "WAITING",
    createdBy: "mock-host-marco",
    createdAt: isoMinutesAgo(45),
    updatedAt: isoMinutesAgo(45)
  }),
  buildMockRoom({
    id: "mock-room-7",
    title: "Energía nuclear para ciudades pequeñas",
    motion:
      "Esta casa financiaría reactores nucleares modulares como parte central de la transición energética.",
    description: null,
    maxSeatsPerSide: 1,
    isPublic: true,
    status: "WAITING",
    format: "OXFORD",
    formatConfig: buildOxfordFormatConfigAtPhase(0),
    createdBy: "mock-host-sara",
    createdAt: isoMinutesAgo(12),
    updatedAt: isoMinutesAgo(12)
  }),
  buildMockRoom({
    id: "mock-room-8",
    title: "Práctica final: vigilancia con reconocimiento facial",
    motion:
      "Esta casa prohibiría el uso de reconocimiento facial en espacios públicos.",
    description:
      "Sesión terminada para contrastar el estado final, fase de resultado y barra completa.",
    maxSeatsPerSide: 2,
    isPublic: true,
    status: "ENDED",
    format: "OXFORD",
    formatConfig: buildOxfordFormatConfigAtPhase(9),
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
