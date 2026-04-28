import type {
  DebateFormat,
  OxfordDebatePhase,
  OxfordFormatConfig,
  RoomStatus
} from "@fallacy/types";

type Translator = (
  key: string,
  values?: Record<string, string | number>
) => string;

const STATUS_BADGE_STYLES: Record<RoomStatus, string> = {
  WAITING:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
  IN_PROGRESS:
    "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300",
  ENDED:
    "border-border/60 bg-foreground/5 text-muted-foreground dark:bg-foreground/10"
};

const SUPPORTED_OXFORD_SEATS = [1, 2, 3] as const;

export const getStatusLabel = (status: RoomStatus, t: Translator): string =>
  t(`room.status.${status}`);

export const getStatusStyles = (status: RoomStatus): string =>
  STATUS_BADGE_STYLES[status];

export const getVisibilityLabel = (isPublic: boolean, t: Translator): string =>
  t(isPublic ? "room.badges.public" : "room.badges.private");

export const getFormatLabel = (format: DebateFormat, t: Translator): string =>
  t(`room.format.${format}`);

export const getSeatsLabel = (
  format: DebateFormat,
  maxSeatsPerSide: number,
  t: Translator
): string | null => {
  if (format !== "OXFORD") {
    return null;
  }
  const isSupportedSeatCount = (
    SUPPORTED_OXFORD_SEATS as readonly number[]
  ).includes(maxSeatsPerSide);
  if (!isSupportedSeatCount) {
    return null;
  }
  return t("room.seatsLabel", { n: maxSeatsPerSide });
};

export const getPhaseLabel = (
  phase: OxfordDebatePhase,
  t: Translator
): string => t(`room.phases.${phase}`);

export const getProgressPercentage = (
  formatConfig: OxfordFormatConfig | null,
  status: RoomStatus
): number => {
  if (status === "ENDED") {
    return 100;
  }
  if (!formatConfig || formatConfig.debatePhases.length === 0) {
    return 0;
  }
  const ratio =
    (formatConfig.currentPhaseIndex + 1) / formatConfig.debatePhases.length;
  const percentage = Math.round(ratio * 100);
  return Math.min(100, Math.max(0, percentage));
};

export const getCreatedAtLabel = (createdAt: string, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(createdAt));
