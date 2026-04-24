import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DebateModule } from './debate/debate.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, DebateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
