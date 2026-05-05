import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface CreateTokenParams {
  roomId: string;
  userId: string;
  role?: 'host' | 'guest';
}

@Injectable()
export class CloudflareService {
  private readonly appId = process.env.CLOUDFLARE_APP_ID!;
  private readonly appSecret = process.env.CLOUDFLARE_APP_SECRET!;

  createToken({ roomId, userId, role = 'guest' }: CreateTokenParams) {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      // Identidad del usuario
      sub: userId,

      // Sala (clave para SFU)
      room: roomId,

      // Permisos
      permissions: this.getPermissions(role),

      // Metadata opcional
      metadata: {
        role,
      },

      // Expiración corta (MUY importante)
      iat: now,
      exp: now + 60 * 5, // 5 minutos
    };

    return jwt.sign(payload, this.appSecret, {
      algorithm: 'HS256',
      issuer: this.appId,
    });
  }

  private getPermissions(role: 'host' | 'guest') {
    if (role === 'host') {
      return {
        publish: true,
        subscribe: true,
        control: true,
      };
    }

    return {
      publish: true,
      subscribe: true,
      control: false,
    };
  }
}
