import { DebateFormat, type Room as PrismaRoom } from '@prisma/client';

import type { RoomBase } from '@fallacy/types';

import { parseOxfordFormatConfig } from './room.schemas';

export const mapRoom = (r: PrismaRoom): RoomBase => {
  return {
    id: r.id,
    title: r.title,
    motion: r.motion,
    description: r.description,
    maxSeatsPerSide: r.maxSeats,
    isPublic: r.isPublic,
    status: r.status,
    createdBy: r.createdBy,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    format: r.format,
    formatConfig:
      r.format === DebateFormat.OXFORD
        ? parseOxfordFormatConfig(r.formatConfig)
        : null,
  };
};
