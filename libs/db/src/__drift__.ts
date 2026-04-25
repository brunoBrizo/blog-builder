/**
 * Compile-time drift assertions between Drizzle `InferSelectModel` types and
 * the Zod `*RowSchema` definitions in `@blog-builder/shared-types`.
 *
 * If Drizzle and Zod disagree about the shape of a row, one of the `Assert*`
 * lines below will resolve to an object literal describing the mismatch —
 * which is not assignable to `true`, so `tsc` fails with a clear error.
 *
 * To update a row schema:
 *   1. Adjust the Drizzle table in `libs/db/src/schema/*`.
 *   2. Mirror the change in the matching `*RowSchema` in `shared-types`.
 *   3. Re-run `pnpm nx run db:typecheck` — these asserts guard the drift.
 *
 * This module has zero runtime side effects; it exists only for the type
 * checker. Nothing from here should be imported at runtime.
 */

import type { z } from 'zod';
import type { InferSelectModel } from 'drizzle-orm';

import {
  adminUsers,
  articleAnalyticsSnapshots,
  articleCitations,
  articleTags,
  articleTranslations,
  articles,
  authors,
  categories,
  categoryTranslations,
  contactMessages,
  generationJobs,
  generationSteps,
  topicQueue,
  newsletterDigestArticles,
  newsletterDigests,
  newsletterSubscribers,
  tags,
  tagTranslations,
} from './schema';

import type { StrictEqual } from '@blog-builder/shared-types';
import {
  AdminUserRowSchema,
  ArticleAnalyticsSnapshotRowSchema,
  ArticleCitationRowSchema,
  ArticleRowSchema,
  ArticleTagRowSchema,
  ArticleTranslationRowSchema,
  AuthorRowSchema,
  CategoryRowSchema,
  CategoryTranslationRowSchema,
  ContactMessageRowSchema,
  GenerationJobRowSchema,
  GenerationStepRowSchema,
  TopicQueueRowSchema,
  NewsletterDigestArticleRowSchema,
  NewsletterDigestRowSchema,
  NewsletterSubscriberRowSchema,
  TagRowSchema,
  TagTranslationRowSchema,
} from '@blog-builder/shared-types';

type ZodOut<S extends z.ZodType> = z.infer<S>;

// Each of these assignments must resolve to `true`. If Drizzle and Zod drift,
// the RHS becomes `{ __mismatch: true; expected: ...; got: ... }` and the
// assignment fails to type-check.

export const _assertAuthor: StrictEqual<
  InferSelectModel<typeof authors>,
  ZodOut<typeof AuthorRowSchema>
> = true;

export const _assertCategory: StrictEqual<
  InferSelectModel<typeof categories>,
  ZodOut<typeof CategoryRowSchema>
> = true;

export const _assertCategoryTranslation: StrictEqual<
  InferSelectModel<typeof categoryTranslations>,
  ZodOut<typeof CategoryTranslationRowSchema>
> = true;

export const _assertTag: StrictEqual<
  InferSelectModel<typeof tags>,
  ZodOut<typeof TagRowSchema>
> = true;

export const _assertTagTranslation: StrictEqual<
  InferSelectModel<typeof tagTranslations>,
  ZodOut<typeof TagTranslationRowSchema>
> = true;

export const _assertArticle: StrictEqual<
  InferSelectModel<typeof articles>,
  ZodOut<typeof ArticleRowSchema>
> = true;

export const _assertArticleTranslation: StrictEqual<
  InferSelectModel<typeof articleTranslations>,
  ZodOut<typeof ArticleTranslationRowSchema>
> = true;

export const _assertArticleCitation: StrictEqual<
  InferSelectModel<typeof articleCitations>,
  ZodOut<typeof ArticleCitationRowSchema>
> = true;

export const _assertArticleTag: StrictEqual<
  InferSelectModel<typeof articleTags>,
  ZodOut<typeof ArticleTagRowSchema>
> = true;

export const _assertArticleAnalyticsSnapshot: StrictEqual<
  InferSelectModel<typeof articleAnalyticsSnapshots>,
  ZodOut<typeof ArticleAnalyticsSnapshotRowSchema>
> = true;

export const _assertGenerationJob: StrictEqual<
  InferSelectModel<typeof generationJobs>,
  ZodOut<typeof GenerationJobRowSchema>
> = true;

export const _assertGenerationStep: StrictEqual<
  InferSelectModel<typeof generationSteps>,
  ZodOut<typeof GenerationStepRowSchema>
> = true;

export const _assertTopicQueue: StrictEqual<
  InferSelectModel<typeof topicQueue>,
  ZodOut<typeof TopicQueueRowSchema>
> = true;

export const _assertNewsletterSubscriber: StrictEqual<
  InferSelectModel<typeof newsletterSubscribers>,
  ZodOut<typeof NewsletterSubscriberRowSchema>
> = true;

export const _assertNewsletterDigest: StrictEqual<
  InferSelectModel<typeof newsletterDigests>,
  ZodOut<typeof NewsletterDigestRowSchema>
> = true;

export const _assertNewsletterDigestArticle: StrictEqual<
  InferSelectModel<typeof newsletterDigestArticles>,
  ZodOut<typeof NewsletterDigestArticleRowSchema>
> = true;

export const _assertContactMessage: StrictEqual<
  InferSelectModel<typeof contactMessages>,
  ZodOut<typeof ContactMessageRowSchema>
> = true;

export const _assertAdminUser: StrictEqual<
  InferSelectModel<typeof adminUsers>,
  ZodOut<typeof AdminUserRowSchema>
> = true;
