import { documents } from '@database/drizzle/schema';
import { type DatabaseContext, InjectDB } from '@database/providers/database.provider';
import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class DocumentsRepository {
  constructor(@InjectDB() private readonly db: DatabaseContext) {}
  async createDocument(data: Omit<typeof documents.$inferInsert, 'id' | 'createdAt'>) {
    return this.db.insert(documents).values(data).returning();
  }

  async findAllByContactId(contactId: number) {
    return this.db.select().from(documents).where(eq(documents.contactId, contactId));
  }

  async findById(id: number, contactId: number) {
    return this.db
      .select()
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.contactId, contactId)))
      .limit(1);
  }

  async updateDocument(
    id: number,
    contactId: number,
    data: Partial<Omit<typeof documents.$inferInsert, 'id' | 'createdAt'>>,
  ) {
    return await this.db
      .update(documents)
      .set(data)
      .where(and(eq(documents.id, id), eq(documents.contactId, contactId)))
      .returning();
  }

  async deleteDocument(id: number, contactId: number) {
    const result = await this.db
      .delete(documents)
      .where(and(eq(documents.id, id), eq(documents.contactId, contactId)))
      .returning();

    return result;
  }
}
