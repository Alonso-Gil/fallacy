import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import {
  createClient,
  SupabaseClient,
  RealtimeChannel,
  REALTIME_SUBSCRIBE_STATES,
} from '@supabase/supabase-js';

import {
  resolveSupabaseUrl,
  resolveSupabaseAnonKey,
} from '../config/supabase-env';
import { CloudflareService } from '../cloudflare/cloudflare.service';

export interface JoinRoomResult {
  roomId: string;
  userId: string;
  role: 'host' | 'guest';
  cloudflareToken: string;
}

export interface RealtimeEvent {
  type: 'USER_JOINED';
  payload: { userId: string; role: string };
}

@Injectable()
export class RealtimeService implements OnModuleDestroy {
  private readonly client: SupabaseClient;
  private readonly channels = new Map<string, RealtimeChannel>();
  private readonly logger = new Logger(RealtimeService.name);

  constructor(private readonly cloudflareService: CloudflareService) {
    const url = resolveSupabaseUrl();
    const key = resolveSupabaseAnonKey();

    if (!url || !key) {
      throw new Error('Supabase env vars are missing');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.client = createClient(url, key);
  }

  private getOrCreateChannel(roomId: string): RealtimeChannel {
    const channelName = `room:${roomId}`;

    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    const channel = this.client.channel(channelName);

    channel.subscribe((status) => {
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        this.logger.log(`Subscribed to channel: ${channelName}`);
      }
    });

    this.channels.set(channelName, channel);

    return channel;
  }

  async broadcastUserJoined(roomId: string, userId: string, role: string) {
    const channel = this.getOrCreateChannel(roomId);

    const event: RealtimeEvent = {
      type: 'USER_JOINED',
      payload: { userId, role },
    };

    await channel.send({
      type: 'broadcast',
      event: event.type,
      payload: event.payload,
    });

    this.logger.log(
      `Broadcast USER_JOINED for user ${userId} in room ${roomId}`,
    );
  }

  async removeChannel(roomId: string) {
    const channelName = `room:${roomId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      await this.client.removeChannel(channel);
      this.channels.delete(channelName);
      this.logger.log(`Removed channel: ${channelName}`);
    }
  }

  generateToken(roomId: string, userId: string, role: 'host' | 'guest') {
    const token = this.cloudflareService.createToken({ roomId, userId, role });
    this.logger.log(
      `Generated Cloudflare token for user ${userId} in room ${roomId}`,
    );
    return token;
  }

  async onModuleDestroy() {
    for (const channel of this.channels.values()) {
      await this.client.removeChannel(channel);
    }
    this.channels.clear();
  }
}
