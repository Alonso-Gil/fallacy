import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { SupabaseAuthGuard } from './supabase-auth.guard';
import { SupabaseAuthService } from './supabase-auth.service';

@Module({
  providers: [
    SupabaseAuthService,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
  ],
  exports: [SupabaseAuthService],
})
export class AuthModule {}
