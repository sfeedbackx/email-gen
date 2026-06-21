import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { languageEnum } from './enums.schema';
import { documents } from './documents.schema';
import { threads } from './threads.schema';
import { users } from './users.schema';

export const contacts = t.pgTable('contacts', {
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: t
    .uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: t.varchar('name', { length: 100 }).notNull(),
  email: t.varchar('email', { length: 255 }),
  context: t.text('context'),
  language: languageEnum('language').notNull().default('en'),
  createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  user: one(users, { fields: [contacts.userId], references: [users.id] }),
  documents: many(documents),
  threads: many(threads),
}));
