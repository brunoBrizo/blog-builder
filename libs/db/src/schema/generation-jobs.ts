import {
  relations,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { createdAtColumn, idColumn, updatedAtColumn } from './_shared';
import { articles } from './articles';
import {
  generationJobStatusEnum,
  generationStepNameEnum,
  generationStepStatusEnum,
  localeEnum,
} from './enums';

export const generationJobs = pgTable(
  'generation_jobs',
  {
    id: idColumn(),
    articleId: uuid('article_id').references(() => articles.id, {
      onDelete: 'set null',
    }),
    topic: text('topic').notNull(),
    targetLocales: jsonb('target_locales')
      .$type<Array<'en' | 'pt-BR' | 'es'>>()
      .notNull()
      .default(sql`'["en"]'::jsonb`),
    status: generationJobStatusEnum('status').notNull().default('pending'),
    startedAt: timestamp('started_at', {
      withTimezone: true,
      mode: 'date',
    }),
    completedAt: timestamp('completed_at', {
      withTimezone: true,
      mode: 'date',
    }),
    totalTokens: integer('total_tokens').notNull().default(0),
    totalCostUsd: numeric('total_cost_usd', { precision: 12, scale: 6 })
      .notNull()
      .default('0'),
    error: text('error'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    generationJobsStatusIdx: index('generation_jobs_status_idx').on(
      table.status,
    ),
    generationJobsArticleIdx: index('generation_jobs_article_idx').on(
      table.articleId,
    ),
    generationJobsCreatedAtIdx: index('generation_jobs_created_at_idx').on(
      table.createdAt,
    ),
  }),
);

export const generationSteps = pgTable(
  'generation_steps',
  {
    id: idColumn(),
    jobId: uuid('job_id')
      .notNull()
      .references(() => generationJobs.id, { onDelete: 'cascade' }),
    stepName: generationStepNameEnum('step_name').notNull(),
    stepOrder: integer('step_order').notNull(),
    locale: localeEnum('locale'),
    status: generationStepStatusEnum('status').notNull().default('pending'),
    model: text('model'),
    input: jsonb('input')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    output: jsonb('output').$type<Record<string, unknown>>(),
    tokensInput: integer('tokens_input').notNull().default(0),
    tokensOutput: integer('tokens_output').notNull().default(0),
    costUsd: numeric('cost_usd', { precision: 12, scale: 6 })
      .notNull()
      .default('0'),
    startedAt: timestamp('started_at', {
      withTimezone: true,
      mode: 'date',
    }),
    completedAt: timestamp('completed_at', {
      withTimezone: true,
      mode: 'date',
    }),
    error: text('error'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    generationStepsJobOrderIdx: index('generation_steps_job_order_idx').on(
      table.jobId,
      table.stepOrder,
    ),
    generationStepsStatusIdx: index('generation_steps_status_idx').on(
      table.status,
    ),
  }),
);

export const generationJobsRelations = relations(
  generationJobs,
  ({ one, many }) => ({
    article: one(articles, {
      fields: [generationJobs.articleId],
      references: [articles.id],
    }),
    steps: many(generationSteps),
  }),
);

export const generationStepsRelations = relations(
  generationSteps,
  ({ one }) => ({
    job: one(generationJobs, {
      fields: [generationSteps.jobId],
      references: [generationJobs.id],
    }),
  }),
);

export type GenerationJob = InferSelectModel<typeof generationJobs>;
export type GenerationJobInsert = InferInsertModel<typeof generationJobs>;
export type GenerationStep = InferSelectModel<typeof generationSteps>;
export type GenerationStepInsert = InferInsertModel<typeof generationSteps>;
