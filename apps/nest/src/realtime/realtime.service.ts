import { Injectable, OnModuleDestroy, Optional, Logger } from '@nestjs/common';
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
  cloudflareToken: string | null;
  sfuEnabled: boolean;
}

export interface RealtimeEvent {
  type: 'USER_JOINED';
  payload: { userId: string; role: string };
}

@Injectable()
export class RealtimeService implements OnModuleDestroy {
  private readonly client: SupabaseClient;
  private readonly channels = new Map<string, RealtimeChannel>();
  private readonly channelReady = new Map<string, Promise<void>>();
  private readonly logger = new Logger(RealtimeService.name);

  constructor(
    @Optional() private readonly cloudflareService?: CloudflareService,
  ) {
    const url = resolveSupabaseUrl();
    const key = resolveSupabaseAnonKey();

    if (!url || !key) {
      throw new Error('Supabase env vars are missing');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.client = createClient(url, key);
  }

  get isCloudflareConfigured(): boolean {
    return this.cloudflareService?.isConfigured ?? false;
  }

  private getOrCreateChannel(roomId: string): RealtimeChannel {
    const channelName = `room:${roomId}`;

    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    const channel = this.client.channel(channelName);

    const readyPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Channel ${channelName} subscription timed out`));
      }, 10_000);

      channel.subscribe((status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          clearTimeout(timeout);
          this.logger.log(`Subscribed to channel: ${channelName}`);
          resolve();
        }
        if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
          clearTimeout(timeout);
          this.logger.error(`Channel ${channelName} subscription error`);
          reject(new Error(`Channel ${channelName} subscription error`));
        }
      });
    });

    this.channels.set(channelName, channel);
    this.channelReady.set(channelName, readyPromise);

    return channel;
  }

  private async waitForChannel(roomId: string): Promise<void> {
    const channelName = `room:${roomId}`;
    const ready = this.channelReady.get(channelName);
    if (ready) {
      await ready;
    }
  }

  async broadcastUserJoined(roomId: string, userId: string, role: string) {
    this.getOrCreateChannel(roomId);
    await this.waitForChannel(roomId);

    const event: RealtimeEvent = {
      type: 'USER_JOINED',
      payload: { userId, role },
    };

    await this.channels.get(`room:${roomId}`)!.send({
      type: 'broadcast',
      event: event.type,
      payload: event.payload,
    });

    this.logger.log(
      `Broadcast USER_JOINED for user ${userId} in room ${roomId}`,
    );
  }

  async broadcastUserLeft(roomId: string, userId: string) {
    const channelName = `room:${roomId}`;
    const channel = this.channels.get(channelName);

    if (!channel) return;

    try {
      await channel.send({
        type: 'broadcast',
        event: 'USER_LEFT',
        payload: { userId },
      });
      this.logger.log(
        `Broadcast USER_LEFT for user ${userId} in room ${roomId}`,
      );
    } catch (err) {
      this.logger.warn(
        `Failed to broadcast USER_LEFT: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async removeChannel(roomId: string) {
    const channelName = `room:${roomId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      await this.client.removeChannel(channel);
      this.channels.delete(channelName);
      this.channelReady.delete(channelName);
      this.logger.log(`Removed channel: ${channelName}`);
    }
  }

  async createCloudflareSession(sessionDescription: {
    type: 'offer' | 'answer';
    sdp: string;
  }) {
    if (!this.cloudflareService?.isConfigured) {
      this.logger.debug('Cloudflare not configured, skipping session creation');
      return null;
    }

    return this.cloudflareService.createSession({ sessionDescription });
  }

  async onModuleDestroy() {
    for (const channel of this.channels.values()) {
      await this.client.removeChannel(channel);
    }
    this.channels.clear();
    this.channelReady.clear();
  }
}
