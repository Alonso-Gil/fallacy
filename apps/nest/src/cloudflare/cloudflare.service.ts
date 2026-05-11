import { BadGatewayException, Injectable, Logger } from '@nestjs/common';

interface SessionDescriptionPayload {
  type: 'offer' | 'answer';
  sdp: string;
}

interface CreateSessionParams {
  sessionDescription: SessionDescriptionPayload;
}

export interface CloudflareSessionResponse {
  errorCode?: string;
  errorDescription?: string;
  message?: string;
  sessionId?: string;
  sessionDescription?: SessionDescriptionPayload;
}

@Injectable()
export class CloudflareService {
  private static readonly baseUrl = 'https://rtc.live.cloudflare.com/v1';
  private readonly appId: string | undefined;
  private readonly appSecret: string | undefined;
  private readonly configured: boolean;
  private readonly logger = new Logger(CloudflareService.name);

  constructor() {
    const appId = process.env.CLOUDFLARE_APP_ID;
    const appSecret = process.env.CLOUDFLARE_APP_SECRET;

    if (!appId || !appSecret) {
      this.logger.warn(
        'Cloudflare TURN/SFU is not configured (missing env vars). SFU mode will be unavailable.',
      );
      this.configured = false;
      return;
    }

    this.logger.log(
      `Cloudflare configured — appId: ${appId.slice(0, 8)}...${appId.slice(-4)}, secret length: ${appSecret.length}`,
    );

    this.appId = appId;
    this.appSecret = appSecret;
    this.configured = true;
  }

  get isConfigured(): boolean {
    return this.configured;
  }

  async createSession({
    sessionDescription,
  }: CreateSessionParams): Promise<CloudflareSessionResponse> {
    if (!this.configured) {
      throw new BadGatewayException('Cloudflare SFU is not configured');
    }

    const response = await fetch(
      `${CloudflareService.baseUrl}/apps/${this.appId}/sessions/new`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.appSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionDescription }),
      },
    );

    const text = await response.text();
    const payload = this.parseCloudflareResponse(text);

    if (!response.ok || payload.errorCode) {
      const description =
        payload.errorDescription ??
        payload.message ??
        response.statusText ??
        'Cloudflare SFU request failed';
      this.logger.error(
        `Cloudflare session creation failed (${response.status}): ${description}`,
      );
      throw new BadGatewayException(description);
    }

    this.logger.log('Created Cloudflare SFU session');
    return payload;
  }

  private parseCloudflareResponse(text: string): CloudflareSessionResponse {
    if (!text) return {};

    try {
      return JSON.parse(text) as CloudflareSessionResponse;
    } catch {
      return { message: text };
    }
  }
}
