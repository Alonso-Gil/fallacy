import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  imports: [PrismaModule],
})
export class RoomsModule {}
