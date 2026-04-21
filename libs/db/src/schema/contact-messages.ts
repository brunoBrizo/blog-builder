import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { createdAtColumn, idColumn, updatedAtColumn } from './_shared';
import { contactMessageStatusEnum, localeEnum } from './enums';

export const contactMessages = pgTable(
  'contact_messages',
  {
    id: idColumn(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    locale: localeEnum('locale'),
    status: contactMessageStatusEnum('status').notNull().default('new'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    repliedAt: timestamp('replied_at', { withTimezone: true, mode: 'date' }),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => ({
    contactMessagesStatusIdx: index('contact_messages_status_idx').on(
      table.status,
    ),
    contactMessagesCreatedAtIdx: index('contact_messages_created_at_idx').on(
      table.createdAt,
    ),
  }),
);

export type ContactMessage = InferSelectModel<typeof contactMessages>;
export type ContactMessageInsert = InferInsertModel<typeof contactMessages>;
