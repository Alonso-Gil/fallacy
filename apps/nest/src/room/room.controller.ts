import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { User } from '@supabase/supabase-js';

import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createRoomBodySchema,
  type CreateRoomBody,
  type UpdateRoomBody,
  updateRoomBodySchema,
} from './room.schemas';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Public()
  @Get('lobby')
  listLobbyPublic() {
    return this.roomService.listLobbyPublic();
  }

  @Public()
  @Get('lobby/:id')
  findOneLobbyPublic(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roomService.findOneLobbyPublic(id);
  }

  @Get()
  listForAuthenticatedUser(@CurrentUser() user: User) {
    return this.roomService.listVisibleForUser(user.id);
  }

  @Get(':id')
  findOneForUser(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.roomService.findOneForUser(id, user.id);
  }

  @Post()
  create(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createRoomBodySchema)) body: CreateRoomBody,
  ) {
    return this.roomService.create(user.id, body);
  }

  @Post(':id/join')
  join(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.roomService.join(id, user.id);
  }

  @Post(':id/refresh-token')
  refreshToken(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.roomService.refreshToken(id, user.id);
  }

  @Post(':id/sfu/session')
  createSfuSession(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body()
    body: {
      sessionDescription?: { type?: 'offer' | 'answer'; sdp?: string };
    },
  ) {
    const sessionDescription = body.sessionDescription;
    if (
      !sessionDescription ||
      (sessionDescription.type !== 'offer' &&
        sessionDescription.type !== 'answer') ||
      typeof sessionDescription.sdp !== 'string'
    ) {
      throw new BadRequestException('Invalid SFU session request');
    }

    return this.roomService.createSfuSession(id, user.id, {
      type: sessionDescription.type,
      sdp: sessionDescription.sdp,
    });
  }

  @Get(':id/participants')
  getParticipants(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.roomService.getParticipants(id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ZodValidationPipe(updateRoomBodySchema)) body: UpdateRoomBody,
  ) {
    return this.roomService.update(id, user.id, body);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.roomService.remove(id, user.id);
  }

  @Post(':id/leave')
  leave(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.roomService.leave(id, user.id);
  }
}
