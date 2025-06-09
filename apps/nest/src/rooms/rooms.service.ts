import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}
  create(createRoomDto: Prisma.roomCreateInput) {
    return this.prisma.room.create({ data: createRoomDto });
  }

  findAll(searchInput?: Prisma.roomWhereInput) {
    searchInput = searchInput ?? undefined;
    return this.prisma.room.findMany({ where: searchInput });
  }

  findOne(room: Prisma.roomWhereUniqueInput) {
    return this.prisma.room.findUnique({ where: room });
  }

  update(id: string, updateRoomDto: Prisma.roomUpdateInput) {
    console.debug(updateRoomDto);
    return this.prisma.room.update({ where: { id }, data: updateRoomDto });
  }

  remove(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }
}
