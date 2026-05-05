import { Module } from '@nestjs/common';

import { RealtimeService } from './realtime.service';
import { CloudflareModule } from '../cloudflare/cloudflare.module';

@Module({
  imports: [CloudflareModule],
  providers: [RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
