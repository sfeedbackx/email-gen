import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { contacts } from './contacts.schema';
import { messages } from './messages.schema';
import { drafts } from './drafts.schema';

export const threads = t.pgTable('threads', {
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  contactId: t
    .bigint('contact_id', { mode: 'number' })
    .notNull()
    .references(() => contacts.id, { onDelete: 'cascade' }),
  subject: t.varchar('subject', { length: 255 }).notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const threadsRelations = relations(threads, ({ one, many }) => ({
  contact: one(contacts, { fields: [threads.contactId], references: [contacts.id] }),
  messages: many(messages),
  drafts: many(drafts),
}));
