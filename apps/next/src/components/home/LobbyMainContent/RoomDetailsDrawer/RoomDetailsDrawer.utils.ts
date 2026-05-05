import type {
  DebateFormat,
  OxfordDebatePhase,
  RoomStatus
} from "@fallacy/types";

type Translator = (
  key: string,
  values?: Record<string, string | number>
) => string;

export const getRoomStatusLabel = (status: RoomStatus, t: Translator): string =>
  t(`room.status.${status}`);

export const getRoomAccessLabel = (isPublic: boolean, t: Translator): string =>
  t(isPublic ? "room.badges.public" : "room.badges.private");

export const getDebateFormatLabel = (
  format: DebateFormat,
  t: Translator
): string => t(`room.details.formatNames.${format}`);

export const getDebatePhaseLabel = (
  phase: OxfordDebatePhase,
  t: Translator
): string => t(`room.phases.${phase}`);

export const getParticipantCapacityLabel = (
  current: number,
  max: number,
  t: Translator
): string => t("room.details.participantCapacity", { current, max });
