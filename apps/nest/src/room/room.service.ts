import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { CreateRoomBody, UpdateRoomBody } from './room.schemas';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, body: CreateRoomBody) {
    return this.prisma.room.create({
      data: {
        title: body.title,
        description: body.description,
        maxSeats: body.maxSeats,
        isPublic: body.isPublic,
        createdBy: userId,
      },
    });
  }

  async listLobbyPublic() {
    return this.prisma.room.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneLobbyPublic(id: string) {
    const room = await this.prisma.room.findFirst({
      where: { id, isPublic: true },
    });
    if (!room) {
      throw new NotFoundException('Not found');
    }
    return room;
  }

  async listVisibleForUser(userId: string) {
    return this.prisma.room.findMany({
      where: {
        OR: [{ isPublic: true }, { createdBy: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(id: string, userId: string) {
    const room = await this.prisma.room.findFirst({
      where: {
        id,
        OR: [{ isPublic: true }, { createdBy: userId }],
      },
    });
    if (!room) {
      throw new NotFoundException('Not found');
    }
    return room;
  }

  async update(id: string, userId: string, body: UpdateRoomBody) {
    const result = await this.prisma.room.updateMany({
      where: { id, createdBy: userId },
      data: {
        title: body.title,
        description: body.description,
        maxSeats: body.maxSeats,
        isPublic: body.isPublic,
        status: body.status,
      },
    });
    if (result.count > 0) {
      return this.prisma.room.findUniqueOrThrow({ where: { id } });
    }
    const row = await this.prisma.room.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Not found');
    }
    throw new ForbiddenException('Forbidden');
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.room.deleteMany({
      where: { id, createdBy: userId },
    });
    if (result.count > 0) {
      return { id };
    }
    const row = await this.prisma.room.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Not found');
    }
    throw new ForbiddenException('Forbidden');
  }
}
