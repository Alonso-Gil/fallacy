import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DebateFormat, Prisma, type Room as PrismaRoom } from '@prisma/client';
import { ParticipantRole } from './participant-role';
import { getDefaultOxfordFormatConfig } from '@fallacy/types';

import type { RoomBase } from '@fallacy/types';

import { PrismaService } from '../prisma.service';
import { RealtimeService } from '../realtime/realtime.service';
import {
  parseOxfordFormatConfig,
  type CreateRoomBody,
  type UpdateRoomBody,
} from './room.schemas';

// Helpers (se mantienen igual, pero ahora el servicio los envuelve en logs)
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
  private readonly logger = new Logger(RoomService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly realtimeService: RealtimeService,
  ) {}

  async create(userId: string, body: CreateRoomBody) {
    this.logger.log(
      `Intentando crear sala: "${body.title}" por el usuario: ${userId}`,
    );

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

    this.logger.log(`Sala creada exitosamente con ID: ${room.id}`);
    return mapRoom(room);
  }

  async listLobbyPublic() {
    this.logger.log('Listando salas públicas del lobby');
    const rooms = await this.prismaService.room.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
    });
    return rooms.map(mapRoom);
  }

  async findOneLobbyPublic(id: string) {
    this.logger.log(`Buscando sala pública con ID: ${id}`);
    const room = await this.prismaService.room.findFirst({
      where: { id, isPublic: true },
    });
    if (!room) {
      this.logger.warn(`Sala pública con ID: ${id} no encontrada`);
      throw new NotFoundException('Not found');
    }
    return mapRoom(room);
  }

  async listVisibleForUser(userId: string) {
    this.logger.log(`Listando salas visibles para el usuario: ${userId}`);
    const rooms = await this.prismaService.room.findMany({
      where: {
        OR: [{ isPublic: true }, { createdBy: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
    return rooms.map(mapRoom);
  }

  async findOneForUser(id: string, userId: string) {
    this.logger.log(`Buscando sala ${id} para el usuario ${userId}`);
    const room = await this.prismaService.room.findFirst({
      where: {
        id,
        OR: [{ isPublic: true }, { createdBy: userId }],
      },
    });
    if (!room) {
      this.logger.warn(
        `Sala ${id} no encontrada o sin acceso para usuario ${userId}`,
      );
      throw new NotFoundException('Not found');
    }
    return mapRoom(room);
  }

  async update(id: string, userId: string, body: UpdateRoomBody) {
    this.logger.log(
      `Iniciando actualización de sala ${id} por usuario ${userId}`,
    );

    const existing = await this.prismaService.room.findFirst({
      where: { id, createdBy: userId },
    });

    if (!existing) {
      const row = await this.prismaService.room.findUnique({ where: { id } });
      if (!row) {
        this.logger.warn(`Intento de actualizar sala inexistente: ${id}`);
        throw new NotFoundException('Not found');
      }
      this.logger.warn(
        `Usuario ${userId} intentó actualizar sala ${id} sin ser el creador`,
      );
      throw new ForbiddenException('Forbidden');
    }

    const nextFormat = body.format ?? existing.format;
    const nextMotion =
      body.motion !== undefined ? body.motion : existing.motion;

    // Logs de validación de lógica de negocio
    if (nextFormat === DebateFormat.OXFORD) {
      if (!nextMotion?.trim()) {
        this.logger.error(
          'Fallo de validación: Formato OXFORD requiere una moción',
        );
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

    this.logger.log(`Sala ${id} actualizada con éxito`);
    return mapRoom(room);
  }

  async remove(id: string, userId: string) {
    this.logger.log(`Intentando eliminar sala ${id} por usuario ${userId}`);

    const result = await this.prismaService.room.deleteMany({
      where: { id, createdBy: userId },
    });

    if (result.count > 0) {
      this.logger.log(`Sala ${id} eliminada correctamente`);
      return { id };
    }

    const row = await this.prismaService.room.findUnique({ where: { id } });
    if (!row) {
      this.logger.warn(`Intento de borrar sala inexistente: ${id}`);
      throw new NotFoundException('Not found');
    }

    this.logger.warn(
      `Usuario ${userId} no tiene permiso para borrar la sala ${id}`,
    );
    throw new ForbiddenException('Forbidden');
  }

  async join(roomId: string, userId: string) {
    this.logger.log(`Usuario ${userId} intentando unirse a la sala ${roomId}`);

    const room = await this.prismaService.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      this.logger.warn(`Sala ${roomId} no encontrada`);
      throw new NotFoundException('Room not found');
    }

    if (!room.isPublic && room.createdBy !== userId) {
      this.logger.warn(
        `Usuario ${userId} intentó unirse a sala privada ${roomId}`,
      );
      throw new ForbiddenException('Cannot join private room');
    }

    const existing = await this.prismaService.participant.findUnique({
      where: {
        userId_roomId: { userId, roomId },
      },
    });

    if (existing) {
      this.logger.log(
        `Usuario ${userId} ya es participante de la sala ${roomId}`,
      );
      const role: 'host' | 'guest' =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        existing.role === ParticipantRole.HOST ? 'host' : 'guest';
      const cloudflareToken = this.realtimeService.generateToken(
        roomId,
        userId,
        role,
      );
      return {
        roomId: room.id,
        userId: existing.userId,
        role,
        cloudflareToken,
      };
    }

    const isHost = room.createdBy === userId;
    const role = isHost ? ParticipantRole.HOST : ParticipantRole.GUEST;

    await this.prismaService.participant.create({
      data: {
        userId,
        roomId,
        role,
      },
    });

    this.logger.log(
      `Usuario ${userId} se unió como ${role} a la sala ${roomId}`,
    );

    await this.realtimeService.broadcastUserJoined(
      roomId,
      userId,
      isHost ? 'host' : 'guest',
    );

    const cloudflareToken = this.realtimeService.generateToken(
      roomId,
      userId,
      isHost ? 'host' : 'guest',
    );

    return {
      roomId: room.id,
      userId,
      role: isHost ? 'host' : ('guest' as const),
      cloudflareToken,
    };
  }

  async getParticipants(roomId: string) {
    const participants = await this.prismaService.participant.findMany({
      where: { roomId },
      orderBy: { joinedAt: 'asc' },
    });

    return participants.map((p) => ({
      userId: p.userId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      role: p.role === ParticipantRole.HOST ? 'host' : 'guest',
      joinedAt: p.joinedAt.toISOString(),
    }));
  }
}
