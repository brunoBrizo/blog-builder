import { pgEnum } from 'drizzle-orm/pg-core';

export const articleStatusEnum = pgEnum('article_status', [
  'draft',
  'scheduled',
  'published',
  'archived',
]);

export const localeEnum = pgEnum('locale', ['en', 'pt-BR', 'es']);

export const generationJobStatusEnum = pgEnum('generation_job_status', [
  'pending',
  'running',
  'succeeded',
  'failed',
  'cancelled',
]);

export const generationTriggerKindEnum = pgEnum('generation_trigger_kind', [
  'manual',
  'scheduled',
]);

export const generationStepNameEnum = pgEnum('generation_step_name', [
  'topic_research',
  'outline',
  'drafting',
  'fact_check',
  'tldr_and_faq',
  'seo_meta',
  'translation',
  'quality_review',
]);

export const generationStepStatusEnum = pgEnum('generation_step_status', [
  'pending',
  'running',
  'succeeded',
  'failed',
  'skipped',
]);

export const newsletterSubscriberStatusEnum = pgEnum(
  'newsletter_subscriber_status',
  ['pending', 'confirmed', 'unsubscribed', 'bounced'],
);

export const newsletterDigestStatusEnum = pgEnum('newsletter_digest_status', [
  'pending',
  'sending',
  'sent',
  'failed',
]);

export const contactMessageStatusEnum = pgEnum('contact_message_status', [
  'new',
  'read',
  'replied',
  'spam',
]);

export const adminRoleEnum = pgEnum('admin_role', [
  'owner',
  'editor',
  'viewer',
]);
