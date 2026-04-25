import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PostInternalArticlesRetrySchema = z.object({
  limit: z.coerce.number().int().min(1).max(25).optional(),
});

export class PostInternalArticlesRetryDto extends createZodDto(
  PostInternalArticlesRetrySchema,
) {}
