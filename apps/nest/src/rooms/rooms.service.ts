import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}
  create(createRoomDto: Prisma.roomCreateInput) {
    return this.prisma.room.create({ data: createRoomDto });
  }

  findAll() {
    return this.prisma.room.findMany();
  }

  findOne(room: Prisma.roomWhereUniqueInput) {
    return this.prisma.room.findUnique({ where: room });
  }

  update(id: number, updateRoomDto: Prisma.roomUpdateInput) {
    console.debug(updateRoomDto);
    return `This action updates a #${id} room `;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
