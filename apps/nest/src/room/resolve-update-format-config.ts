import { DebateFormat, Prisma, type Room as PrismaRoom } from '@prisma/client';
import { getDefaultOxfordFormatConfig } from '@fallacy/types';

import type { UpdateRoomBody } from './room.schemas';

export const resolveUpdateFormatConfig = (
  body: UpdateRoomBody,
  existing: PrismaRoom,
  nextFormat: DebateFormat,
): Prisma.RoomUpdateInput['formatConfig'] | undefined => {
  if (body.formatConfig !== undefined) {
    if (body.formatConfig === null) {
      if (nextFormat === DebateFormat.OXFORD) {
        return getDefaultOxfordFormatConfig();
      }
      return Prisma.DbNull;
    }
    if (nextFormat === DebateFormat.OXFORD) {
      return body.formatConfig;
    }
    return undefined;
  }
  if (body.format === undefined) {
    return undefined;
  }
  if (nextFormat === DebateFormat.OXFORD) {
    if (existing.format === DebateFormat.OXFORD) {
      return undefined;
    }
    return getDefaultOxfordFormatConfig();
  }
  return Prisma.DbNull;
};
