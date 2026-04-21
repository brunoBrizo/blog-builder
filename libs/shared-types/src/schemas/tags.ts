import { z } from 'zod';

import {
  LocaleSchema,
  NameSchema,
  SlugSchema,
  TimestampSchema,
  UuidSchema,
} from './common';

/** Row mirror of `tags`. */
export const TagRowSchema = z.object({
  id: z.string().uuid(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.nullable(),
});
export type TagRow = z.infer<typeof TagRowSchema>;

/** Row mirror of `tag_translations`. */
export const TagTranslationRowSchema = z.object({
  id: z.string().uuid(),
  tagId: z.string().uuid(),
  locale: LocaleSchema,
  name: z.string(),
  slug: z.string(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type TagTranslationRow = z.infer<typeof TagTranslationRowSchema>;

export const TagTranslationInputSchema = z.object({
  locale: LocaleSchema,
  name: NameSchema,
  slug: SlugSchema,
});
export type TagTranslationInput = z.infer<typeof TagTranslationInputSchema>;

export const TagCreateSchema = z.object({
  translations: z.array(TagTranslationInputSchema).min(1),
});
export type TagCreate = z.infer<typeof TagCreateSchema>;

export const TagUpdateSchema = z.object({
  translations: z.array(TagTranslationInputSchema).min(1).optional(),
});
export type TagUpdate = z.infer<typeof TagUpdateSchema>;

/** Public read shape — a tag in a specific locale. */
export const PublicTagSchema = z.object({
  id: UuidSchema,
  locale: LocaleSchema,
  name: z.string(),
  slug: SlugSchema,
});
export type PublicTag = z.infer<typeof PublicTagSchema>;
