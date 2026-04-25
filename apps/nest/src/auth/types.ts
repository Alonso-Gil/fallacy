import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';

export interface RequestWithUser extends Request {
  user: User;
}
