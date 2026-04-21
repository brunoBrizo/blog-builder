import { z } from 'zod';

import {
  NewsletterDigestStatusSchema,
  NewsletterSubscriberStatusSchema,
} from './enums';
import {
  EmailSchema,
  LocaleSchema,
  NonNegativeIntSchema,
  OpaqueTokenSchema,
  TimestampSchema,
  UuidSchema,
} from './common';

/** Row mirror of `newsletter_subscribers`. */
export const NewsletterSubscriberRowSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  locale: LocaleSchema,
  status: NewsletterSubscriberStatusSchema,
  confirmationToken: z.string(),
  confirmedAt: TimestampSchema.nullable(),
  unsubscribeToken: z.string(),
  unsubscribedAt: TimestampSchema.nullable(),
  source: z.string().nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type NewsletterSubscriberRow = z.infer<
  typeof NewsletterSubscriberRowSchema
>;

/** Row mirror of `newsletter_digests`. */
export const NewsletterDigestRowSchema = z.object({
  id: z.string().uuid(),
  locale: LocaleSchema,
  scheduledFor: TimestampSchema,
  sentAt: TimestampSchema.nullable(),
  status: NewsletterDigestStatusSchema,
  subject: z.string(),
  previewText: z.string().nullable(),
  recipientCount: z.number().int(),
  articleIds: z.array(z.string()),
  providerMessageId: z.string().nullable(),
  error: z.string().nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type NewsletterDigestRow = z.infer<typeof NewsletterDigestRowSchema>;

/** Row mirror of `newsletter_digest_articles` (join table). */
export const NewsletterDigestArticleRowSchema = z.object({
  digestId: z.string().uuid(),
  articleId: z.string().uuid(),
  orderIndex: z.number().int(),
  createdAt: TimestampSchema,
});
export type NewsletterDigestArticleRow = z.infer<
  typeof NewsletterDigestArticleRowSchema
>;

// ---------- Public write DTOs (subscribe / unsubscribe / confirm) ----------

export const NewsletterSubscribeInputSchema = z.object({
  email: EmailSchema,
  locale: LocaleSchema,
  source: z.string().max(100).nullish(),
});
export type NewsletterSubscribeInput = z.infer<
  typeof NewsletterSubscribeInputSchema
>;

export const NewsletterConfirmInputSchema = z.object({
  token: OpaqueTokenSchema,
});
export type NewsletterConfirmInput = z.infer<
  typeof NewsletterConfirmInputSchema
>;

export const NewsletterUnsubscribeInputSchema = z.object({
  token: OpaqueTokenSchema,
});
export type NewsletterUnsubscribeInput = z.infer<
  typeof NewsletterUnsubscribeInputSchema
>;

// ---------- Admin DTOs ----------

export const NewsletterDigestCreateSchema = z.object({
  locale: LocaleSchema,
  scheduledFor: z.coerce.date(),
  subject: z.string().trim().min(1).max(150),
  previewText: z.string().trim().max(200).nullish(),
  articleIds: z.array(UuidSchema).min(1).max(20),
});
export type NewsletterDigestCreate = z.infer<
  typeof NewsletterDigestCreateSchema
>;

export const NewsletterDigestUpdateSchema = z
  .object({
    status: NewsletterDigestStatusSchema,
    sentAt: z.coerce.date().nullish(),
    recipientCount: NonNegativeIntSchema,
    providerMessageId: z.string().max(200).nullish(),
    error: z.string().nullish(),
  })
  .partial();
export type NewsletterDigestUpdate = z.infer<
  typeof NewsletterDigestUpdateSchema
>;
