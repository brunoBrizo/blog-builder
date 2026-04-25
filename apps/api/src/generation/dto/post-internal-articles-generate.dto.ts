import { LocaleSchema } from '@blog-builder/shared-types';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PostInternalArticlesGenerateSchema = z.object({
  /** Omit or leave empty for scheduled dequeue (topic_queue + refill). */
  topicSeed: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().min(1).max(500).optional(),
  ),
  locales: z.array(LocaleSchema).min(1).max(3).optional(),
  /** Defaults true when `topicSeed` is omitted (cron), false when seed is provided. */
  autoPublish: z.boolean().optional(),
});

export class PostInternalArticlesGenerateDto extends createZodDto(
  PostInternalArticlesGenerateSchema,
) {}
