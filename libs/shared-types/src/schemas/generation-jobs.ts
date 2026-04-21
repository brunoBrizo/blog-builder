import { z } from 'zod';

import {
  GenerationJobStatusSchema,
  GenerationStepNameSchema,
  GenerationStepStatusSchema,
} from './enums';
import {
  LocaleSchema,
  NameSchema,
  NonNegativeIntSchema,
  NumericStringSchema,
  TimestampSchema,
  UuidSchema,
} from './common';

const JsonRecordShape = z.record(z.string(), z.unknown());

/** Row mirror of `generation_jobs`. */
export const GenerationJobRowSchema = z.object({
  id: z.string().uuid(),
  articleId: z.string().uuid().nullable(),
  topic: z.string(),
  targetLocales: z.array(LocaleSchema),
  status: GenerationJobStatusSchema,
  startedAt: TimestampSchema.nullable(),
  completedAt: TimestampSchema.nullable(),
  totalTokens: z.number().int(),
  totalCostUsd: z.string(),
  error: z.string().nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type GenerationJobRow = z.infer<typeof GenerationJobRowSchema>;

/** Row mirror of `generation_steps`. */
export const GenerationStepRowSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  stepName: GenerationStepNameSchema,
  stepOrder: z.number().int(),
  locale: LocaleSchema.nullable(),
  status: GenerationStepStatusSchema,
  model: z.string().nullable(),
  input: JsonRecordShape,
  output: JsonRecordShape.nullable(),
  tokensInput: z.number().int(),
  tokensOutput: z.number().int(),
  costUsd: z.string(),
  startedAt: TimestampSchema.nullable(),
  completedAt: TimestampSchema.nullable(),
  error: z.string().nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type GenerationStepRow = z.infer<typeof GenerationStepRowSchema>;

// ---------- Write DTOs ----------

export const GenerationJobCreateSchema = z.object({
  topic: NameSchema.max(500),
  targetLocales: z.array(LocaleSchema).min(1).max(3),
  articleId: UuidSchema.nullish(),
});
export type GenerationJobCreate = z.infer<typeof GenerationJobCreateSchema>;

export const GenerationJobUpdateSchema = z
  .object({
    status: GenerationJobStatusSchema,
    articleId: UuidSchema.nullish(),
    startedAt: z.coerce.date().nullish(),
    completedAt: z.coerce.date().nullish(),
    totalTokens: NonNegativeIntSchema,
    totalCostUsd: NumericStringSchema,
    error: z.string().nullish(),
  })
  .partial();
export type GenerationJobUpdate = z.infer<typeof GenerationJobUpdateSchema>;

export const GenerationStepUpsertSchema = z.object({
  jobId: UuidSchema,
  stepName: GenerationStepNameSchema,
  stepOrder: NonNegativeIntSchema,
  locale: LocaleSchema.nullish(),
  status: GenerationStepStatusSchema,
  model: z.string().max(200).nullish(),
  input: JsonRecordShape.default({}),
  output: JsonRecordShape.nullish(),
  tokensInput: NonNegativeIntSchema.default(0),
  tokensOutput: NonNegativeIntSchema.default(0),
  costUsd: NumericStringSchema.default('0'),
  startedAt: z.coerce.date().nullish(),
  completedAt: z.coerce.date().nullish(),
  error: z.string().nullish(),
});
export type GenerationStepUpsert = z.infer<typeof GenerationStepUpsertSchema>;
