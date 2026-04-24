import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { DebateService } from './debate.service';

@Controller('debate')
export class DebateController {
  constructor(private readonly debateService: DebateService) {}

  @Post()
  create(
    @Body()
    createDebateDto: {
      title: string;
      topic: string;
      createdBy: string;
    },
  ) {
    return this.debateService.create(createDebateDto);
  }

  @Get()
  findAll() {
    return this.debateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDebateDto: { title?: string; topic?: string },
  ) {
    return this.debateService.update(id, updateDebateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debateService.remove(id);
  }
}
