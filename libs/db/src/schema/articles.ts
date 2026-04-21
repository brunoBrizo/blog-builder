import {
  relations,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import {
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import {
  createdAtColumn,
  deletedAtColumn,
  idColumn,
  updatedAtColumn,
} from './_shared';
import { authors } from './authors';
import { categories } from './categories';
import { articleStatusEnum, localeEnum } from './enums';
import { tags } from './tags';

/**
 * Postgres `tsvector` — Drizzle has no first-class type for it, so declare a
 * custom type. The column itself is defined here; the generated expression and
 * GIN index are added in feature 09.
 */
const tsvector = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const articles = pgTable(
  'articles',
  {
    id: idColumn(),
    authorId: uuid('author_id')
      .notNull()
      .references(() => authors.id, { onDelete: 'restrict' }),
    categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    defaultLocale: localeEnum('default_locale').notNull().default('en'),
    status: articleStatusEnum('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', {
      withTimezone: true,
      mode: 'date',
    }),
    coverImageUrl: text('cover_image_url'),
    ogImageUrl: text('og_image_url'),
    wordCountTarget: integer('word_count_target').notNull().default(1500),
    wordCountActual: integer('word_count_actual'),
    tokenCostTotal: integer('token_cost_total').notNull().default(0),
    sourcePrompt: text('source_prompt'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => ({
    articlesStatusPublishedAtIdx: index('articles_status_published_at_idx').on(
      table.status,
      table.publishedAt,
    ),
    articlesAuthorIdx: index('articles_author_idx').on(table.authorId),
    articlesCategoryIdx: index('articles_category_idx').on(table.categoryId),
    articlesDeletedAtIdx: index('articles_deleted_at_idx').on(table.deletedAt),
  }),
);

export const articleTranslations = pgTable(
  'article_translations',
  {
    id: idColumn(),
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    locale: localeEnum('locale').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    tldr: text('tldr').notNull(),
    keyTakeaways: jsonb('key_takeaways')
      .$type<string[]>()
      .notNull()
      .default([]),
    bodyMarkdown: text('body_markdown').notNull(),
    bodyHtml: text('body_html').notNull(),
    faq: jsonb('faq')
      .$type<{ question: string; answer: string }[]>()
      .notNull()
      .default([]),
    metaTitle: text('meta_title').notNull(),
    metaDescription: text('meta_description').notNull(),
    ogTitle: text('og_title'),
    ogDescription: text('og_description'),
    readingTimeMinutes: integer('reading_time_minutes').notNull().default(0),
    /**
     * Full-text search column. Populated by a generated column expression +
     * GIN index defined in feature 09 (search). Kept here so it appears in the
     * generated schema and Drizzle knows about it.
     */
    searchVector: tsvector('search_vector'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    articleTranslationsArticleLocaleUnique: uniqueIndex(
      'article_translations_article_locale_unique',
    ).on(table.articleId, table.locale),
    articleTranslationsSlugLocaleUnique: uniqueIndex(
      'article_translations_slug_locale_unique',
    ).on(table.locale, table.slug),
  }),
);

export const articleCitations = pgTable(
  'article_citations',
  {
    id: idColumn(),
    articleTranslationId: uuid('article_translation_id')
      .notNull()
      .references(() => articleTranslations.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    title: text('title'),
    snippet: text('snippet'),
    publisher: text('publisher'),
    publishedAt: timestamp('published_at', {
      withTimezone: true,
      mode: 'date',
    }),
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    articleCitationsTranslationIdx: index(
      'article_citations_translation_idx',
    ).on(table.articleTranslationId),
  }),
);

export const articleTags = pgTable(
  'article_tags',
  {
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    articleTagsPk: primaryKey({ columns: [table.articleId, table.tagId] }),
    articleTagsTagIdx: index('article_tags_tag_idx').on(table.tagId),
  }),
);

export const articleAnalyticsSnapshots = pgTable(
  'article_analytics_snapshots',
  {
    id: idColumn(),
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    locale: localeEnum('locale').notNull(),
    periodStart: timestamp('period_start', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    periodEnd: timestamp('period_end', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    sessions: integer('sessions').notNull().default(0),
    pageviews: integer('pageviews').notNull().default(0),
    averageEngagementSeconds: integer('average_engagement_seconds')
      .notNull()
      .default(0),
    bounceRateBps: integer('bounce_rate_bps').notNull().default(0),
    rawPayload: jsonb('raw_payload')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    articleAnalyticsArticlePeriodIdx: index(
      'article_analytics_article_period_idx',
    ).on(table.articleId, table.periodStart),
    articleAnalyticsLocalePeriodIdx: index(
      'article_analytics_locale_period_idx',
    ).on(table.locale, table.periodStart),
  }),
);

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  translations: many(articleTranslations),
  tags: many(articleTags),
  analyticsSnapshots: many(articleAnalyticsSnapshots),
}));

export const articleTranslationsRelations = relations(
  articleTranslations,
  ({ one, many }) => ({
    article: one(articles, {
      fields: [articleTranslations.articleId],
      references: [articles.id],
    }),
    citations: many(articleCitations),
  }),
);

export const articleCitationsRelations = relations(
  articleCitations,
  ({ one }) => ({
    translation: one(articleTranslations, {
      fields: [articleCitations.articleTranslationId],
      references: [articleTranslations.id],
    }),
  }),
);

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id],
  }),
  tag: one(tags, {
    fields: [articleTags.tagId],
    references: [tags.id],
  }),
}));

export const articleAnalyticsSnapshotsRelations = relations(
  articleAnalyticsSnapshots,
  ({ one }) => ({
    article: one(articles, {
      fields: [articleAnalyticsSnapshots.articleId],
      references: [articles.id],
    }),
  }),
);

export type Article = InferSelectModel<typeof articles>;
export type ArticleInsert = InferInsertModel<typeof articles>;
export type ArticleTranslation = InferSelectModel<typeof articleTranslations>;
export type ArticleTranslationInsert = InferInsertModel<
  typeof articleTranslations
>;
export type ArticleCitation = InferSelectModel<typeof articleCitations>;
export type ArticleCitationInsert = InferInsertModel<typeof articleCitations>;
export type ArticleTag = InferSelectModel<typeof articleTags>;
export type ArticleTagInsert = InferInsertModel<typeof articleTags>;
export type ArticleAnalyticsSnapshot = InferSelectModel<
  typeof articleAnalyticsSnapshots
>;
export type ArticleAnalyticsSnapshotInsert = InferInsertModel<
  typeof articleAnalyticsSnapshots
>;
