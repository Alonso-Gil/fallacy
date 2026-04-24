import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DebateService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; topic: string; createdBy: string }) {
    return this.prisma.debate.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.debate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.debate.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: { title?: string; topic?: string }) {
    return this.prisma.debate.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.debate.delete({
      where: { id },
    });
  }
}
