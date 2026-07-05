import { threads } from '@database/drizzle/schema';
import { type DatabaseContext, InjectDB } from '@database/providers/database.provider';
import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class ThreadsRepository {
  constructor(@InjectDB() private readonly db: DatabaseContext) {}
  async createThread(data: Omit<typeof threads.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.db.insert(threads).values(data).returning();
  }

  async findAllByContactId(contactId: number) {
    return this.db.select().from(threads).where(eq(threads.contactId, contactId));
  }

  async findById(id: number, contactId: number) {
    return this.db
      .select()
      .from(threads)
      .where(and(eq(threads.id, id), eq(threads.contactId, contactId)))
      .limit(1);
  }

  async findByIdWithDetails(id: number, contactId: number) {
    const result = await this.db.query.threads.findFirst({
      where: and(eq(threads.id, id), eq(threads.contactId, contactId)),
      with: {
        messages: true,
        drafts: true,
      },
    });

    return result ?? null;
  }

  async updateThread(
    id: number,
    contactId: number,
    data: Partial<Omit<typeof threads.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>>,
  ) {
    return this.db
      .update(threads)
      .set(data)
      .where(and(eq(threads.id, id), eq(threads.contactId, contactId)))
      .returning();
  }

  async deleteThread(id: number, contactId: number) {
    return this.db
      .delete(threads)
      .where(and(eq(threads.id, id), eq(threads.contactId, contactId)))
      .returning();
  }
}
