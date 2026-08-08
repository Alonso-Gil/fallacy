import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodType, z } from 'zod';
import { treeifyError } from 'zod';

export class ZodValidationPipe<T extends ZodType> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.infer<T> {
    const r = this.schema.safeParse(value);
    if (!r.success) {
      throw new BadRequestException({
        message: 'Bad request',
        issues: treeifyError(r.error),
      });
    }
    return r.data;
  }
}
