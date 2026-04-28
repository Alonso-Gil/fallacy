import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DebateFormat, Prisma, type Room as PrismaRoom } from '@prisma/client';
import { getDefaultOxfordFormatConfig } from '@fallacy/types';

import type { RoomBase } from '@fallacy/types';

import { PrismaService } from '../prisma.service';
import {
  parseOxfordFormatConfig,
  type CreateRoomBody,
  type UpdateRoomBody,
} from './room.schemas';

const resolveUpdateFormatConfig = (
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

const mapRoom = (r: PrismaRoom): RoomBase => {
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

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, body: CreateRoomBody) {
    const room = await this.prismaService.room.create({
      data: {
        title: body.title,
        motion: body.motion,
        description: body.description,
        maxSeats: body.maxSeatsPerSide,
        isPublic: body.isPublic,
        format: body.format,
        formatConfig:
          body.formatConfig === null
            ? Prisma.DbNull
            : (body.formatConfig as Prisma.InputJsonValue),
        createdBy: userId,
      },
    });
    return mapRoom(room);
  }

  async listLobbyPublic() {
    const rooms = await this.prismaService.room.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
    });
    return rooms.map(mapRoom);
  }

  async findOneLobbyPublic(id: string) {
    const room = await this.prismaService.room.findFirst({
      where: { id, isPublic: true },
    });
    if (!room) {
      throw new NotFoundException('Not found');
    }
    return mapRoom(room);
  }

  async listVisibleForUser(userId: string) {
    const rooms = await this.prismaService.room.findMany({
      where: {
        OR: [{ isPublic: true }, { createdBy: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
    return rooms.map(mapRoom);
  }

  async findOneForUser(id: string, userId: string) {
    const room = await this.prismaService.room.findFirst({
      where: {
        id,
        OR: [{ isPublic: true }, { createdBy: userId }],
      },
    });
    if (!room) {
      throw new NotFoundException('Not found');
    }
    return mapRoom(room);
  }

  async update(id: string, userId: string, body: UpdateRoomBody) {
    const existing = await this.prismaService.room.findFirst({
      where: { id, createdBy: userId },
    });
    if (!existing) {
      const row = await this.prismaService.room.findUnique({ where: { id } });
      if (!row) {
        throw new NotFoundException('Not found');
      }
      throw new ForbiddenException('Forbidden');
    }
    const nextFormat = body.format ?? existing.format;
    const nextMotion =
      body.motion !== undefined ? body.motion : existing.motion;
    if (nextFormat === DebateFormat.OXFORD) {
      if (!nextMotion?.trim()) {
        throw new BadRequestException('Invalid request');
      }
    } else {
      if (body.formatConfig != null) {
        throw new BadRequestException('Invalid request');
      }
    }
    const nextMaxSeats = body.maxSeatsPerSide ?? body.maxSeats;
    const data: Prisma.RoomUpdateInput = {};
    if (body.title !== undefined) {
      data.title = body.title;
    }
    if (body.description !== undefined) {
      data.description = body.description;
    }
    if (body.isPublic !== undefined) {
      data.isPublic = body.isPublic;
    }
    if (body.status !== undefined) {
      data.status = body.status;
    }
    if (nextMaxSeats !== undefined) {
      data.maxSeats = nextMaxSeats;
    }
    if (body.format !== undefined) {
      data.format = body.format;
    }
    if (body.motion !== undefined) {
      data.motion = body.motion;
    }
    const nextFormatConfig = resolveUpdateFormatConfig(
      body,
      existing,
      nextFormat,
    );
    if (nextFormatConfig !== undefined) {
      data.formatConfig = nextFormatConfig;
    }
    const room = await this.prismaService.room.update({
      where: { id },
      data,
    });
    return mapRoom(room);
  }

  async remove(id: string, userId: string) {
    const result = await this.prismaService.room.deleteMany({
      where: { id, createdBy: userId },
    });
    if (result.count > 0) {
      return { id };
    }
    const row = await this.prismaService.room.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Not found');
    }
    throw new ForbiddenException('Forbidden');
  }
}
