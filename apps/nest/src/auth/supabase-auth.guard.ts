import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from './public.decorator';
import { SupabaseAuthService } from './supabase-auth.service';
import type { RequestWithUser } from './types';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private supabaseAuth: SupabaseAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    if (!this.supabaseAuth.isConfigured()) {
      throw new ServiceUnavailableException('Service unavailable');
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractBearerToken(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.supabaseAuth.getUserFromAccessToken(token);
    request.user = user;
    return true;
  }

  private extractBearerToken(authorization: unknown): string | undefined {
    if (
      typeof authorization !== 'string' ||
      !authorization.startsWith('Bearer ')
    ) {
      return undefined;
    }
    return authorization.slice(7).trim() || undefined;
  }
}
