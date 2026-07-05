import { messages } from '@database/drizzle/schema';
import { type DatabaseContext, InjectDB } from '@database/providers/database.provider';
import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class MessagesRepository {
  constructor(@InjectDB() private readonly db: DatabaseContext) {}
  async createMessage(data: Omit<typeof messages.$inferInsert, 'id' | 'createdAt'>) {
    return this.db.insert(messages).values(data).returning();
  }

  async findAllByThreadId(threadId: number) {
    return this.db
      .select()
      .from(messages)
      .where(eq(messages.threadId, threadId))
      .orderBy(messages.createdAt);
  }

  async findById(id: number, threadId: number) {
    return this.db
      .select()
      .from(messages)
      .where(and(eq(messages.id, id), eq(messages.threadId, threadId)))
      .limit(1);
  }

  async deleteMessage(id: number, threadId: number) {
    return this.db
      .delete(messages)
      .where(and(eq(messages.id, id), eq(messages.threadId, threadId)))
      .returning();
  }
}
