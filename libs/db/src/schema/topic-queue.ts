import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import {
  index,
  numeric,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { createdAtColumn, idColumn, updatedAtColumn } from './_shared';
import { articles } from './articles';
import { generationJobs } from './generation-jobs';

/**
 * Pending article topics for scheduled generation (Perplexity refill + dequeue).
 * `normalized_topic` is unique for dedupe; `status` is app-managed text.
 */
export const topicQueue = pgTable(
  'topic_queue',
  {
    id: idColumn(),
    normalizedTopic: text('normalized_topic').notNull(),
    displayTitle: text('display_title').notNull(),
    score: numeric('score', { precision: 8, scale: 2 }).notNull().default('0'),
    source: text('source').notNull().default('research'),
    status: text('status').notNull().default('available'),
    generationJobId: uuid('generation_job_id').references(
      () => generationJobs.id,
      { onDelete: 'set null' },
    ),
    articleId: uuid('article_id').references(() => articles.id, {
      onDelete: 'set null',
    }),
    lastError: text('last_error'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    topicQueueNormalizedUq: uniqueIndex('topic_queue_normalized_topic_uq').on(
      table.normalizedTopic,
    ),
    topicQueueStatusScoreIdx: index('topic_queue_status_score_idx').on(
      table.status,
      table.score,
    ),
    topicQueueJobIdx: index('topic_queue_generation_job_idx').on(
      table.generationJobId,
    ),
  }),
);

export const topicQueueRelations = relations(topicQueue, ({ one }) => ({
  job: one(generationJobs, {
    fields: [topicQueue.generationJobId],
    references: [generationJobs.id],
  }),
  article: one(articles, {
    fields: [topicQueue.articleId],
    references: [articles.id],
  }),
}));

export type TopicQueueRow = InferSelectModel<typeof topicQueue>;
export type TopicQueueInsert = InferInsertModel<typeof topicQueue>;
