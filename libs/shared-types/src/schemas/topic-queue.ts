import { z } from 'zod';

import { NameSchema, TimestampSchema, UuidSchema } from './common';

/** Row mirror of `topic_queue`. */
export const TopicQueueRowSchema = z.object({
  id: UuidSchema,
  normalizedTopic: z.string(),
  displayTitle: z.string(),
  score: z.string(),
  source: z.string(),
  status: z.string(),
  generationJobId: UuidSchema.nullable(),
  articleId: UuidSchema.nullable(),
  lastError: z.string().nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type TopicQueueRow = z.infer<typeof TopicQueueRowSchema>;

export const TopicQueueInsertSchema = z.object({
  normalizedTopic: NameSchema.max(500),
  displayTitle: NameSchema.max(500),
  score: z.string().optional(),
  source: z.string().max(32).optional(),
  status: z.string().max(32).optional(),
});
export type TopicQueueInsert = z.infer<typeof TopicQueueInsertSchema>;
