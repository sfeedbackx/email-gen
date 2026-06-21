import { contacts } from '@database/drizzle/schema';
import { type DatabaseContext, InjectDB } from '@database/providers/database.provider';
import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class ContactsRepository {
  constructor(@InjectDB() private readonly db: DatabaseContext) { }
  async createContact(data: Omit<typeof contacts.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    const result = await this.db.insert(contacts).values(data).returning();

    return result;
  }

  async findAllByUserId(userId: string) {
    return this.db.select().from(contacts).where(eq(contacts.userId, userId));
  }

  async findById(id: number, userId: string) {
    const result = await this.db
      .select()
      .from(contacts)
      .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
      .limit(1);

    return result;
  }

  async findByIdWithDetails(id: number, userId: string) {
    const result = await this.db.query.contacts.findFirst({
      where: and(eq(contacts.id, id), eq(contacts.userId, userId)),
      with: {
        documents: true,
        threads: true,
      },
    });

    return result;
  }

  async updateContact(
    id: number,
    userId: string,
    data: Partial<Omit<typeof contacts.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>>,
  ) {
    const result = await this.db
      .update(contacts)
      .set(data)
      .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
      .returning();

    return result;
  }

  async deleteContact(id: number, userId: string) {
    const result = await this.db
      .delete(contacts)
      .where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
      .returning();

    return result;
  }
}
