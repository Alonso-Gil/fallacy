import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [AuthModule, PrismaModule, RoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
