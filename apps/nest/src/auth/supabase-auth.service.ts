import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createClient,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js';

import {
  resolveSupabaseAnonKey,
  resolveSupabaseUrl,
} from '../config/supabase-env';

@Injectable()
export class SupabaseAuthService {
  private readonly client: SupabaseClient | null;

  constructor() {
    const url = resolveSupabaseUrl();
    const key = resolveSupabaseAnonKey();
    this.client = url && key ? createClient(url, key) : null;
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  async getUserFromAccessToken(accessToken: string): Promise<User> {
    if (!this.client) {
      throw new ServiceUnavailableException('Service unavailable');
    }
    const { data, error } = await this.client.auth.getUser(accessToken);
    if (error || !data.user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return data.user;
  }
}
