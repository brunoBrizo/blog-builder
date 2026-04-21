import { z } from 'zod';

import {
  LocaleSchema,
  NameSchema,
  ShortTextSchema,
  SlugSchema,
  TimestampSchema,
  UuidSchema,
} from './common';

/** Row mirror of `categories`. */
export const CategoryRowSchema = z.object({
  id: z.string().uuid(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.nullable(),
});
export type CategoryRow = z.infer<typeof CategoryRowSchema>;

/** Row mirror of `category_translations`. */
export const CategoryTranslationRowSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  locale: LocaleSchema,
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type CategoryTranslationRow = z.infer<
  typeof CategoryTranslationRowSchema
>;

/**
 * Create DTO — categories are always created with their default-locale
 * translation in a single transaction, so we accept a nested payload.
 */
export const CategoryTranslationInputSchema = z.object({
  locale: LocaleSchema,
  name: NameSchema,
  slug: SlugSchema,
  description: ShortTextSchema.nullish(),
});
export type CategoryTranslationInput = z.infer<
  typeof CategoryTranslationInputSchema
>;

export const CategoryCreateSchema = z.object({
  translations: z
    .array(CategoryTranslationInputSchema)
    .min(1, 'At least one translation is required'),
});
export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = z.object({
  translations: z.array(CategoryTranslationInputSchema).min(1).optional(),
});
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;

/** Public read shape per locale, used by navigation and article pages. */
export const PublicCategorySchema = z.object({
  id: UuidSchema,
  locale: LocaleSchema,
  name: z.string(),
  slug: SlugSchema,
  description: z.string().nullable(),
});
export type PublicCategory = z.infer<typeof PublicCategorySchema>;
