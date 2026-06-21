import { drafts } from '@database/drizzle/schema';
import { type DatabaseContext, InjectDB } from '@database/providers/database.provider';
import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class DraftsRepository {
  constructor(@InjectDB() private readonly db: DatabaseContext) { }
  async createDraft(data: Omit<typeof drafts.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await this.db.insert(drafts).values(data).returning();

    return result[0] ?? null;
  }

  async findAllByThreadId(threadId: number) {
    return this.db
      .select()
      .from(drafts)
      .where(eq(drafts.threadId, threadId))
      .orderBy(drafts.createdAt);
  }

  async findById(id: number, threadId: number) {
    const result = await this.db
      .select()
      .from(drafts)
      .where(and(eq(drafts.id, id), eq(drafts.threadId, threadId)))
      .limit(1);

    return result;
  }

  async updateDraft(
    id: number,
    threadId: number,
    data: Partial<Omit<typeof drafts.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>>,
  ) {
    const result = await this.db
      .update(drafts)
      .set(data)
      .where(and(eq(drafts.id, id), eq(drafts.threadId, threadId)))
      .returning();

    return result;
  }

  async deleteDraft(id: number, threadId: number) {
    const result = await this.db
      .delete(drafts)
      .where(and(eq(drafts.id, id), eq(drafts.threadId, threadId)))
      .returning();

    return result;
  }
}
