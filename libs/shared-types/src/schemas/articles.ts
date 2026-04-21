import { z } from 'zod';

import { ArticleStatusSchema } from './enums';
import { PublicAuthorSchema } from './authors';
import { PublicCategorySchema } from './categories';
import { PublicTagSchema } from './tags';
import {
  LocaleSchema,
  LooseUrlSchema,
  NameSchema,
  NonNegativeIntSchema,
  PositiveIntSchema,
  ShortTextSchema,
  SlugSchema,
  TimestampSchema,
  UrlSchema,
  UuidSchema,
} from './common';

const FaqItemShape = z.object({
  question: z.string(),
  answer: z.string(),
});

const AnalyticsPayloadShape = z.record(z.string(), z.unknown());

/** Row mirror of `articles`. */
export const ArticleRowSchema = z.object({
  id: z.string().uuid(),
  authorId: z.string().uuid(),
  categoryId: z.string().uuid().nullable(),
  defaultLocale: LocaleSchema,
  status: ArticleStatusSchema,
  publishedAt: TimestampSchema.nullable(),
  coverImageUrl: z.string().nullable(),
  ogImageUrl: z.string().nullable(),
  wordCountTarget: z.number().int(),
  wordCountActual: z.number().int().nullable(),
  tokenCostTotal: z.number().int(),
  sourcePrompt: z.string().nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.nullable(),
});
export type ArticleRow = z.infer<typeof ArticleRowSchema>;

/** Row mirror of `article_translations`. */
export const ArticleTranslationRowSchema = z.object({
  id: z.string().uuid(),
  articleId: z.string().uuid(),
  locale: LocaleSchema,
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  tldr: z.string(),
  keyTakeaways: z.array(z.string()),
  bodyMarkdown: z.string(),
  bodyHtml: z.string(),
  faq: z.array(FaqItemShape),
  metaTitle: z.string(),
  metaDescription: z.string(),
  ogTitle: z.string().nullable(),
  ogDescription: z.string().nullable(),
  readingTimeMinutes: z.number().int(),
  /** tsvector column; Postgres returns the raw string — usually we ignore it. */
  searchVector: z.string().nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type ArticleTranslationRow = z.infer<typeof ArticleTranslationRowSchema>;

/** Row mirror of `article_citations`. */
export const ArticleCitationRowSchema = z.object({
  id: z.string().uuid(),
  articleTranslationId: z.string().uuid(),
  url: z.string(),
  title: z.string().nullable(),
  snippet: z.string().nullable(),
  publisher: z.string().nullable(),
  publishedAt: TimestampSchema.nullable(),
  orderIndex: z.number().int(),
  createdAt: TimestampSchema,
});
export type ArticleCitationRow = z.infer<typeof ArticleCitationRowSchema>;

/** Row mirror of the `article_tags` join table. */
export const ArticleTagRowSchema = z.object({
  articleId: z.string().uuid(),
  tagId: z.string().uuid(),
  createdAt: TimestampSchema,
});
export type ArticleTagRow = z.infer<typeof ArticleTagRowSchema>;

/** Row mirror of `article_analytics_snapshots`. */
export const ArticleAnalyticsSnapshotRowSchema = z.object({
  id: z.string().uuid(),
  articleId: z.string().uuid(),
  locale: LocaleSchema,
  periodStart: TimestampSchema,
  periodEnd: TimestampSchema,
  sessions: z.number().int(),
  pageviews: z.number().int(),
  averageEngagementSeconds: z.number().int(),
  bounceRateBps: z.number().int(),
  rawPayload: AnalyticsPayloadShape,
  createdAt: TimestampSchema,
});
export type ArticleAnalyticsSnapshotRow = z.infer<
  typeof ArticleAnalyticsSnapshotRowSchema
>;

// ---------- Write DTOs ----------

export const ArticleCitationInputSchema = z.object({
  url: LooseUrlSchema,
  title: NameSchema.nullish(),
  snippet: ShortTextSchema.nullish(),
  publisher: NameSchema.nullish(),
  publishedAt: z.coerce.date().nullish(),
  orderIndex: NonNegativeIntSchema.default(0),
});
export type ArticleCitationInput = z.infer<typeof ArticleCitationInputSchema>;

export const ArticleTranslationInputSchema = z.object({
  locale: LocaleSchema,
  slug: SlugSchema,
  title: z.string().trim().min(1).max(300),
  subtitle: z.string().trim().max(400).nullish(),
  tldr: z.string().trim().min(1).max(1200),
  keyTakeaways: z.array(z.string().trim().min(1).max(500)).max(12).default([]),
  bodyMarkdown: z.string().min(1),
  bodyHtml: z.string().min(1),
  faq: z
    .array(
      z.object({
        question: z.string().trim().min(1).max(500),
        answer: z.string().trim().min(1).max(2000),
      }),
    )
    .max(30)
    .default([]),
  metaTitle: z.string().trim().min(1).max(70),
  metaDescription: z.string().trim().min(1).max(170),
  ogTitle: z.string().trim().max(120).nullish(),
  ogDescription: z.string().trim().max(200).nullish(),
  readingTimeMinutes: PositiveIntSchema.default(1),
  citations: z.array(ArticleCitationInputSchema).max(50).default([]),
});
export type ArticleTranslationInput = z.infer<
  typeof ArticleTranslationInputSchema
>;

export const ArticleCreateSchema = z.object({
  authorId: UuidSchema,
  categoryId: UuidSchema.nullish(),
  defaultLocale: LocaleSchema,
  status: ArticleStatusSchema.default('draft'),
  publishedAt: z.coerce.date().nullish(),
  coverImageUrl: UrlSchema.nullish(),
  ogImageUrl: UrlSchema.nullish(),
  wordCountTarget: PositiveIntSchema.default(1500),
  sourcePrompt: z.string().max(8000).nullish(),
  tagIds: z.array(UuidSchema).max(20).default([]),
  translations: z.array(ArticleTranslationInputSchema).min(1),
});
export type ArticleCreate = z.infer<typeof ArticleCreateSchema>;

export const ArticleUpdateSchema = ArticleCreateSchema.partial();
export type ArticleUpdate = z.infer<typeof ArticleUpdateSchema>;

// ---------- Public read shapes ----------

/** Public citation rendered next to the article body. */
export const PublicArticleCitationSchema = z.object({
  url: z.string(),
  title: z.string().nullable(),
  snippet: z.string().nullable(),
  publisher: z.string().nullable(),
  publishedAt: TimestampSchema.nullable(),
});
export type PublicArticleCitation = z.infer<typeof PublicArticleCitationSchema>;

/**
 * Full article payload returned to website readers for a given locale.
 * Assembled by the API; no direct 1:1 with a single table.
 */
export const PublicArticleSchema = z.object({
  id: UuidSchema,
  locale: LocaleSchema,
  status: ArticleStatusSchema,
  publishedAt: TimestampSchema.nullable(),
  slug: SlugSchema,
  title: z.string(),
  subtitle: z.string().nullable(),
  tldr: z.string(),
  keyTakeaways: z.array(z.string()),
  bodyHtml: z.string(),
  faq: z.array(FaqItemShape),
  metaTitle: z.string(),
  metaDescription: z.string(),
  ogTitle: z.string().nullable(),
  ogDescription: z.string().nullable(),
  coverImageUrl: z.string().nullable(),
  ogImageUrl: z.string().nullable(),
  readingTimeMinutes: z.number().int(),
  wordCountActual: z.number().int().nullable(),
  author: PublicAuthorSchema,
  category: PublicCategorySchema.nullable(),
  tags: z.array(PublicTagSchema),
  citations: z.array(PublicArticleCitationSchema),
});
export type PublicArticle = z.infer<typeof PublicArticleSchema>;

/** Lightweight card shape for listing pages. */
export const PublicArticleSummarySchema = z.object({
  id: UuidSchema,
  locale: LocaleSchema,
  slug: SlugSchema,
  title: z.string(),
  subtitle: z.string().nullable(),
  tldr: z.string(),
  coverImageUrl: z.string().nullable(),
  publishedAt: TimestampSchema.nullable(),
  readingTimeMinutes: z.number().int(),
  author: PublicAuthorSchema,
  category: PublicCategorySchema.nullable(),
  tags: z.array(PublicTagSchema),
});
export type PublicArticleSummary = z.infer<typeof PublicArticleSummarySchema>;
