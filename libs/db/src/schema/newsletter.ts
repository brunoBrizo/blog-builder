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

import { createdAtColumn, idColumn, updatedAtColumn } from './_shared';
import { articles } from './articles';
import {
  localeEnum,
  newsletterDigestStatusEnum,
  newsletterSubscriberStatusEnum,
} from './enums';

/**
 * Postgres `citext` for case-insensitive email addresses.
 */
const citext = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'citext';
  },
});

export const newsletterSubscribers = pgTable(
  'newsletter_subscribers',
  {
    id: idColumn(),
    email: citext('email').notNull(),
    locale: localeEnum('locale').notNull().default('en'),
    status: newsletterSubscriberStatusEnum('status')
      .notNull()
      .default('pending'),
    confirmationToken: text('confirmation_token').notNull(),
    confirmedAt: timestamp('confirmed_at', {
      withTimezone: true,
      mode: 'date',
    }),
    unsubscribeToken: text('unsubscribe_token').notNull(),
    unsubscribedAt: timestamp('unsubscribed_at', {
      withTimezone: true,
      mode: 'date',
    }),
    source: text('source'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    newsletterSubscribersEmailLocaleUnique: uniqueIndex(
      'newsletter_subscribers_email_locale_unique',
    ).on(table.email, table.locale),
    newsletterSubscribersStatusIdx: index(
      'newsletter_subscribers_status_idx',
    ).on(table.status),
    newsletterSubscribersConfirmationTokenUnique: uniqueIndex(
      'newsletter_subscribers_confirmation_token_unique',
    ).on(table.confirmationToken),
    newsletterSubscribersUnsubscribeTokenUnique: uniqueIndex(
      'newsletter_subscribers_unsubscribe_token_unique',
    ).on(table.unsubscribeToken),
  }),
);

export const newsletterDigests = pgTable(
  'newsletter_digests',
  {
    id: idColumn(),
    locale: localeEnum('locale').notNull(),
    scheduledFor: timestamp('scheduled_for', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true, mode: 'date' }),
    status: newsletterDigestStatusEnum('status').notNull().default('pending'),
    subject: text('subject').notNull(),
    previewText: text('preview_text'),
    recipientCount: integer('recipient_count').notNull().default(0),
    articleIds: jsonb('article_ids')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    providerMessageId: text('provider_message_id'),
    error: text('error'),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    newsletterDigestsLocaleScheduledIdx: index(
      'newsletter_digests_locale_scheduled_idx',
    ).on(table.locale, table.scheduledFor),
    newsletterDigestsStatusIdx: index('newsletter_digests_status_idx').on(
      table.status,
    ),
  }),
);

export const newsletterDigestArticles = pgTable(
  'newsletter_digest_articles',
  {
    digestId: uuid('digest_id')
      .notNull()
      .references(() => newsletterDigests.id, { onDelete: 'cascade' }),
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull().default(0),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    newsletterDigestArticlesPk: primaryKey({
      columns: [table.digestId, table.articleId],
    }),
    newsletterDigestArticlesArticleIdx: index(
      'newsletter_digest_articles_article_idx',
    ).on(table.articleId),
  }),
);

export const newsletterDigestsRelations = relations(
  newsletterDigests,
  ({ many }) => ({
    digestArticles: many(newsletterDigestArticles),
  }),
);

export const newsletterDigestArticlesRelations = relations(
  newsletterDigestArticles,
  ({ one }) => ({
    digest: one(newsletterDigests, {
      fields: [newsletterDigestArticles.digestId],
      references: [newsletterDigests.id],
    }),
    article: one(articles, {
      fields: [newsletterDigestArticles.articleId],
      references: [articles.id],
    }),
  }),
);

export type NewsletterSubscriber = InferSelectModel<
  typeof newsletterSubscribers
>;
export type NewsletterSubscriberInsert = InferInsertModel<
  typeof newsletterSubscribers
>;
export type NewsletterDigest = InferSelectModel<typeof newsletterDigests>;
export type NewsletterDigestInsert = InferInsertModel<typeof newsletterDigests>;
export type NewsletterDigestArticle = InferSelectModel<
  typeof newsletterDigestArticles
>;
export type NewsletterDigestArticleInsert = InferInsertModel<
  typeof newsletterDigestArticles
>;
