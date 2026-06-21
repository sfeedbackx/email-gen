import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { threads } from './threads.schema';

export const drafts = t.pgTable('drafts', {
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  threadId: t
    .bigint('thread_id', { mode: 'number' })
    .notNull()
    .references(() => threads.id, { onDelete: 'cascade' }),
  content: t.text('content').notNull(),
  prompt: t.text('prompt'), // what you asked AI to write — useful to tweak and regenerate
  createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const draftsRelations = relations(drafts, ({ one }) => ({
  thread: one(threads, { fields: [drafts.threadId], references: [threads.id] }),
}));
