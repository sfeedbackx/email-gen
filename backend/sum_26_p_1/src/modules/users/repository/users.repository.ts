
import { users } from '@database/drizzle/schema/users.schema';
import {type DatabaseContext, InjectDB } from '@database/providers/database.provider';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  constructor(@InjectDB() private readonly db: DatabaseContext) {}

  async findByEmail(email: string) {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result;
  }

  async findById(id: string) {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result;
  }

  async findLiteUserById(id: string) {
    const result = await this.db
      .select({
        firstName: users.firstName,
        gender: users.gender,
        lastName: users.lastName,
        profilePicture: users.profilePicture,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result;
  }
async createUser(
  data: Omit<typeof users.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const result = await this.db
    .insert(users)
    .values(data)
    .returning();

  return result;
}


async updateUser(
  id: string,
  data: Partial<Omit<typeof users.$inferInsert, 'id' | 'createdAt'>>,
) {
  const result = await this.db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();

  return result;
}

async deleteUser(id: string) {
  const result = await this.db
    .delete(users)
    .where(eq(users.id, id))
    .returning();

  return result;
}
}
