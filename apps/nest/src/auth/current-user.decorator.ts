import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import type { User } from '@supabase/supabase-js';

import type { RequestWithUser } from './types';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (!request.user) {
      throw new InternalServerErrorException('Internal error');
    }
    return request.user;
  },
);
