import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { messageRoleEnum } from './enums.schema';
import { threads } from './threads.schema';

export const messages = t.pgTable('messages', {
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  threadId: t
    .bigint('thread_id', { mode: 'number' })
    .notNull()
    .references(() => threads.id, { onDelete: 'cascade' }),
  role: messageRoleEnum('role').notNull(), // ME = you wrote it | CONTACT = pasted reply
  content: t.text('content').notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  thread: one(threads, { fields: [messages.threadId], references: [threads.id] }),
}));
