import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DebateService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; topic: string; createdBy: string }) {
    const createdBy = this.normalizeUuid(data.createdBy);

    return this.prisma.debate.create({
      data: {
        ...data,
        createdBy,
      },
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

  private normalizeUuid(value: string): string {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(value)) {
      return value;
    }

    // Build a deterministic UUID-like value from any non-UUID input (e.g. usernames).
    const hash = createHash('sha1').update(value).digest('hex');
    return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
  }
}
