import { z } from 'zod';
import { RoomStatus } from '@prisma/client';

const title = z
  .string()
  .min(1, { message: 'Title is required' })
  .max(200, { message: 'Title is too long' })
  .trim();

const description = z
  .string()
  .max(5_000, { message: 'Description is too long' })
  .trim()
  .optional()
  .nullable();

export const createRoomBodySchema = z
  .object({
    title,
    description: z.union([z.string().max(5_000).trim(), z.null()]).optional(),
    maxSeats: z
      .number()
      .int()
      .min(2, { message: 'maxSeats must be at least 2' })
      .max(64, { message: 'maxSeats is too high' })
      .optional(),
    isPublic: z.boolean().optional(),
  })
  .strict()
  .transform((d) => ({
    title: d.title,
    description: d.description ?? null,
    maxSeats: d.maxSeats ?? 4,
    isPublic: d.isPublic ?? true,
  }));

export const updateRoomBodySchema = z
  .object({
    title: title.optional(),
    description: description,
    maxSeats: z.number().int().min(2).max(64).optional(),
    isPublic: z.boolean().optional(),
    status: z.nativeEnum(RoomStatus).optional(),
  })
  .strict()
  .refine((o) => Object.keys(o).length > 0, {
    message: 'At least one field is required',
  });

export type CreateRoomBody = z.infer<typeof createRoomBodySchema>;
export type UpdateRoomBody = z.infer<typeof updateRoomBodySchema>;
