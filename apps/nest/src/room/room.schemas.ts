import { z } from 'zod';
import {
  getDefaultOxfordFormatConfig,
  type OxfordDebatePhase,
  type OxfordFormatConfig,
} from '@fallacy/types';
import { DebateFormat, RoomStatus } from '@prisma/client';

const oxfordDebatePhase = z.enum([
  'MOTION_PRESENTATION',
  'INITIAL_AUDIENCE_VOTE',
  'OPENING_PROPOSITION',
  'OPENING_OPPOSITION',
  'ARGUMENT_REBUTTAL_ROUNDS',
  'AUDIENCE_OR_MODERATOR_QUESTIONS',
  'CLOSING_OPPOSITION',
  'CLOSING_PROPOSITION',
  'FINAL_AUDIENCE_VOTE',
  'RESULT',
]);

const audienceVotingResult = z
  .object({
    propositionVotes: z.number().int().min(0),
    oppositionVotes: z.number().int().min(0),
    abstainVotes: z.number().int().min(0),
  })
  .strict();

const oxfordFormatConfigSchema = z
  .object({
    debatePhases: z.array(oxfordDebatePhase).min(1),
    currentPhase: oxfordDebatePhase,
    currentPhaseIndex: z.number().int().min(0),
    phaseStartedAt: z.union([z.string(), z.null()]),
    initialAudienceVotingResult: z.union([audienceVotingResult, z.null()]),
    finalAudienceVotingResult: z.union([audienceVotingResult, z.null()]),
  })
  .strict()
  .refine((c) => c.currentPhaseIndex < c.debatePhases.length, {
    message: 'currentPhaseIndex is out of range for debatePhases',
  })
  .refine((c) => c.debatePhases[c.currentPhaseIndex] === c.currentPhase, {
    message: 'currentPhase and currentPhaseIndex are inconsistent',
  });

const motionField = z
  .string()
  .max(5_000, { message: 'Motion is too long' })
  .trim()
  .optional()
  .nullable();

const formatConfigField = z
  .union([oxfordFormatConfigSchema, z.null()])
  .optional();

const parseVoting = (
  v: unknown,
): OxfordFormatConfig['initialAudienceVotingResult'] => {
  if (v === null) {
    return null;
  }
  const parsed = audienceVotingResult.safeParse(v);
  return parsed.success ? parsed.data : null;
};

const parsePhaseStartedAt = (v: unknown, def: string | null): string | null => {
  if (v === undefined) {
    return def;
  }
  if (v === null) {
    return null;
  }
  if (typeof v === 'string' && v.length > 0) {
    return v;
  }
  return def;
};

const resolveOxfordPhaseState = (
  o: Record<string, unknown>,
  debatePhases: OxfordDebatePhase[],
  def: OxfordFormatConfig,
): Pick<OxfordFormatConfig, 'currentPhase' | 'currentPhaseIndex'> => {
  const first = debatePhases[0] ?? def.currentPhase;
  const idxRaw =
    typeof o.currentPhaseIndex === 'number'
      ? Math.floor(o.currentPhaseIndex)
      : null;
  const isValidIndex =
    idxRaw !== null && idxRaw >= 0 && idxRaw < debatePhases.length;
  const candidate =
    typeof o.currentPhase === 'string'
      ? oxfordDebatePhase.safeParse(o.currentPhase)
      : null;
  if (candidate?.success && debatePhases.includes(candidate.data)) {
    const p = candidate.data;
    return { currentPhase: p, currentPhaseIndex: debatePhases.indexOf(p) };
  }
  if (isValidIndex && idxRaw !== null) {
    return {
      currentPhase: debatePhases[idxRaw] ?? first,
      currentPhaseIndex: idxRaw,
    };
  }
  return { currentPhase: first, currentPhaseIndex: 0 };
};

export const parseOxfordFormatConfig = (value: unknown): OxfordFormatConfig => {
  const def = getDefaultOxfordFormatConfig();
  if (value === null || typeof value !== 'object' || !value) {
    return def;
  }
  const o = value as Record<string, unknown>;
  const fromDb = z.array(oxfordDebatePhase).min(0).safeParse(o.debatePhases);
  const debatePhases =
    fromDb.success && fromDb.data.length > 0
      ? fromDb.data
      : [...def.debatePhases];
  if (debatePhases.length === 0) {
    return {
      ...def,
      initialAudienceVotingResult: parseVoting(o.initialAudienceVotingResult),
      finalAudienceVotingResult: parseVoting(o.finalAudienceVotingResult),
      phaseStartedAt: parsePhaseStartedAt(o.phaseStartedAt, def.phaseStartedAt),
    };
  }
  const phaseState = resolveOxfordPhaseState(o, debatePhases, def);
  return {
    debatePhases,
    currentPhase: phaseState.currentPhase,
    currentPhaseIndex: phaseState.currentPhaseIndex,
    phaseStartedAt: parsePhaseStartedAt(o.phaseStartedAt, def.phaseStartedAt),
    initialAudienceVotingResult: parseVoting(o.initialAudienceVotingResult),
    finalAudienceVotingResult: parseVoting(o.finalAudienceVotingResult),
  };
};

const title = z
  .string()
  .min(1, { message: 'Title is required' })
  .max(200, { message: 'Title is too long' })
  .trim();

const description = z
  .string()
  .max(5_000, { message: 'Description is too long' })
  .trim()
  .optional()
  .nullable();

const createRoomInputSchema = z
  .object({
    title,
    description: z.union([z.string().max(5_000).trim(), z.null()]).optional(),
    motion: motionField,
    maxSeatsPerSide: z
      .number()
      .int()
      .min(1, { message: 'maxSeatsPerSide must be at least 1' })
      .max(3, { message: 'maxSeatsPerSide must be at most 3' })
      .optional(),
    isPublic: z.boolean().optional(),
    format: z.nativeEnum(DebateFormat).optional(),
    formatConfig: formatConfigField,
  })
  .strict()
  .superRefine((val, ctx) => {
    const format = val.format ?? DebateFormat.OXFORD;
    if (format === DebateFormat.OXFORD) {
      const m = val.motion;
      if (
        m === null ||
        m === undefined ||
        (typeof m === 'string' && m.trim() === '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Motion is required',
          path: ['motion'],
        });
      }
    } else if (val.formatConfig != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid request',
        path: ['formatConfig'],
      });
    }
  });

export const createRoomBodySchema = createRoomInputSchema.transform((d) => {
  const format = d.format ?? DebateFormat.OXFORD;
  let motionValue: string | null = null;
  if (d.motion !== null && d.motion !== undefined && d.motion !== '') {
    motionValue = d.motion.trim();
  }
  if (format === DebateFormat.OXFORD) {
    return {
      title: d.title,
      description: d.description ?? null,
      motion: motionValue as string,
      maxSeatsPerSide: d.maxSeatsPerSide ?? 2,
      isPublic: d.isPublic ?? true,
      format,
      formatConfig: d.formatConfig ?? getDefaultOxfordFormatConfig(),
    };
  }
  return {
    title: d.title,
    description: d.description ?? null,
    motion: motionValue,
    maxSeatsPerSide: d.maxSeatsPerSide ?? 2,
    isPublic: d.isPublic ?? true,
    format,
    formatConfig: null,
  };
});

const updateRoomInputSchema = z
  .object({
    title: title.optional(),
    description: description,
    motion: motionField,
    maxSeats: z.number().int().min(1).max(3).optional(),
    maxSeatsPerSide: z.number().int().min(1).max(3).optional(),
    isPublic: z.boolean().optional(),
    status: z.nativeEnum(RoomStatus).optional(),
    format: z.nativeEnum(DebateFormat).optional(),
    formatConfig: formatConfigField,
  })
  .strict()
  .superRefine((o, ctx) => {
    if (Object.keys(o).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field is required',
      });
      return;
    }
    if (o.format !== undefined && o.format !== DebateFormat.OXFORD) {
      if (o.formatConfig !== undefined && o.formatConfig !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid request',
          path: ['formatConfig'],
        });
      }
    }
    if (o.format === DebateFormat.OXFORD && o.motion !== undefined) {
      const isEmpty =
        o.motion === null || o.motion === '' || o.motion.trim() === '';
      if (isEmpty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Motion is required',
          path: ['motion'],
        });
      }
    }
  });

export const updateRoomBodySchema = updateRoomInputSchema;

export type CreateRoomBody = z.infer<typeof createRoomBodySchema>;
export type UpdateRoomBody = z.infer<typeof updateRoomBodySchema>;
