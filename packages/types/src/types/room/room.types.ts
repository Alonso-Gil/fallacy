export type OxfordDebatePhase =
  | "MOTION_PRESENTATION"
  | "INITIAL_AUDIENCE_VOTE"
  | "OPENING_PROPOSITION"
  | "OPENING_OPPOSITION"
  | "ARGUMENT_REBUTTAL_ROUNDS"
  | "AUDIENCE_OR_MODERATOR_QUESTIONS"
  | "CLOSING_OPPOSITION"
  | "CLOSING_PROPOSITION"
  | "FINAL_AUDIENCE_VOTE"
  | "RESULT";

export type AudienceVotingResult = {
  propositionVotes: number;
  oppositionVotes: number;
  abstainVotes: number;
};

export const OXFORD_DEFAULT_DEBATE_PHASES: readonly OxfordDebatePhase[] = [
  "MOTION_PRESENTATION",
  "INITIAL_AUDIENCE_VOTE",
  "OPENING_PROPOSITION",
  "OPENING_OPPOSITION",
  "ARGUMENT_REBUTTAL_ROUNDS",
  "AUDIENCE_OR_MODERATOR_QUESTIONS",
  "CLOSING_OPPOSITION",
  "CLOSING_PROPOSITION",
  "FINAL_AUDIENCE_VOTE",
  "RESULT"
] as const;

export type OxfordFormatConfig = {
  debatePhases: OxfordDebatePhase[];
  currentPhase: OxfordDebatePhase;
  currentPhaseIndex: number;
  phaseStartedAt: string | null;
  initialAudienceVotingResult: AudienceVotingResult | null;
  finalAudienceVotingResult: AudienceVotingResult | null;
};

export const getDefaultOxfordFormatConfig = (): OxfordFormatConfig => ({
  debatePhases: [...OXFORD_DEFAULT_DEBATE_PHASES],
  currentPhase: "MOTION_PRESENTATION",
  currentPhaseIndex: 0,
  phaseStartedAt: null,
  initialAudienceVotingResult: null,
  finalAudienceVotingResult: null
});

export type DebateFormat =
  | "OXFORD"
  | "BRITISH_PARLIAMENTARY"
  | "WORLD_SCHOOLS"
  | "FREE"
  | "CUSTOM";

export type RoomStatus = "WAITING" | "IN_PROGRESS" | "ENDED";

export type RoomBase = {
  id: string;
  title: string;
  motion: string | null;
  description: string | null;
  maxSeatsPerSide: number;
  isPublic: boolean;
  status: RoomStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  format: DebateFormat;
  formatConfig: OxfordFormatConfig | null;
};
