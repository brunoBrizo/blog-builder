import { LocaleSchema } from '@blog-builder/shared-types';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PostInternalArticlesGenerateSchema = z.object({
  topicSeed: z.string().min(1).max(500),
  locales: z.array(LocaleSchema).min(1).max(3).optional(),
  autoPublish: z.boolean().optional(),
});

export class PostInternalArticlesGenerateDto extends createZodDto(
  PostInternalArticlesGenerateSchema,
) {}
