import { z } from 'zod';

import { ContactMessageStatusSchema } from './enums';
import {
  EmailSchema,
  LocaleSchema,
  NameSchema,
  TimestampSchema,
} from './common';

/** Row mirror of `contact_messages`. */
export const ContactMessageRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  subject: z.string(),
  message: z.string(),
  locale: LocaleSchema.nullable(),
  status: ContactMessageStatusSchema,
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  repliedAt: TimestampSchema.nullable(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});
export type ContactMessageRow = z.infer<typeof ContactMessageRowSchema>;

/** Public submit payload from the contact form. */
export const ContactMessageCreateSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(10).max(5000),
  locale: LocaleSchema.nullish(),
});
export type ContactMessageCreate = z.infer<typeof ContactMessageCreateSchema>;

/** Admin triage update. */
export const ContactMessageUpdateSchema = z
  .object({
    status: ContactMessageStatusSchema,
    repliedAt: z.coerce.date().nullish(),
  })
  .partial();
export type ContactMessageUpdate = z.infer<typeof ContactMessageUpdateSchema>;
