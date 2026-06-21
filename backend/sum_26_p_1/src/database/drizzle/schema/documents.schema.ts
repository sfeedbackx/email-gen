import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { contacts } from './contacts.schema';

export const documents = t.pgTable('documents', {
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  contactId: t
    .bigint('contact_id', { mode: 'number' })
    .notNull()
    .references(() => contacts.id, { onDelete: 'cascade' }),
  filename: t.varchar('filename', { length: 255 }).notNull(),
  description: t.text('description'), // e.g. "My CV Oct 2024" or "Homework ch3 Linear Algebra"
  createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  contact: one(contacts, { fields: [documents.contactId], references: [contacts.id] }),
}));
