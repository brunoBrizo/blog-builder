import { z } from 'zod';

/**
 * Mirrors of every `pgEnum` declared in `libs/db/src/schema/enums.ts`.
 *
 * When you add or reorder a database enum, update the matching schema here
 * and rely on the drift asserts in `libs/db/src/__drift__.ts` to fail the
 * compile if the two sides fall out of sync.
 */

export const ArticleStatusSchema = z.enum([
  'draft',
  'scheduled',
  'published',
  'archived',
]);
export type ArticleStatus = z.infer<typeof ArticleStatusSchema>;

export const GenerationJobStatusSchema = z.enum([
  'pending',
  'running',
  'succeeded',
  'failed',
  'cancelled',
]);
export type GenerationJobStatus = z.infer<typeof GenerationJobStatusSchema>;

export const GenerationTriggerKindSchema = z.enum(['manual', 'scheduled']);
export type GenerationTriggerKind = z.infer<typeof GenerationTriggerKindSchema>;

export const GenerationStepNameSchema = z.enum([
  'topic_research',
  'outline',
  'drafting',
  'fact_check',
  'tldr_and_faq',
  'seo_meta',
  'translation',
  'quality_review',
]);
export type GenerationStepName = z.infer<typeof GenerationStepNameSchema>;

export const GenerationStepStatusSchema = z.enum([
  'pending',
  'running',
  'succeeded',
  'failed',
  'skipped',
]);
export type GenerationStepStatus = z.infer<typeof GenerationStepStatusSchema>;

export const NewsletterSubscriberStatusSchema = z.enum([
  'pending',
  'confirmed',
  'unsubscribed',
  'bounced',
]);
export type NewsletterSubscriberStatus = z.infer<
  typeof NewsletterSubscriberStatusSchema
>;

export const NewsletterDigestStatusSchema = z.enum([
  'pending',
  'sending',
  'sent',
  'failed',
]);
export type NewsletterDigestStatus = z.infer<
  typeof NewsletterDigestStatusSchema
>;

export const ContactMessageStatusSchema = z.enum([
  'new',
  'read',
  'replied',
  'spam',
]);
export type ContactMessageStatus = z.infer<typeof ContactMessageStatusSchema>;

export const AdminRoleSchema = z.enum(['owner', 'editor', 'viewer']);
export type AdminRole = z.infer<typeof AdminRoleSchema>;
