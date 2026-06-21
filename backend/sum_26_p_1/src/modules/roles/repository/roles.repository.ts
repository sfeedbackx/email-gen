import { rolePermissions, roles, userRoles } from '@database/drizzle/schema/users.schema';
import { type DatabaseContext, InjectDB } from '@database/providers/database.provider';
import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { UserType } from '@modules/users/dto/users.enums';

@Injectable()
export class RolesRepository {
  constructor(@InjectDB() private readonly db: DatabaseContext) { }

  async findRoleById(id: number) {
    return await this.db.select().from(roles).where(eq(roles.id, id));
  }

  async getDefaultRole(targetType: UserType) {
    const result = await this.db
      .select()
      .from(roles)
      .where(and(eq(roles.isDefault, true), eq(roles.targetType, targetType)));

    return result;
  }

  async findUserRoles(userId: string): Promise<{ roleId: number }[]> {
    return this.db
      .select({ roleId: userRoles.roleId })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));
  }

  async insertUserRole(userId: string, roleId: number) {
    return await this.db
      .insert(userRoles)
      .values({
        userId,
        roleId,
      })
      .returning();
  }

  async findUserRoleByRoleIdAndUserId(
    userId: string,
    roleId: number,
  ): Promise<{ roleId: number; userId: string } | null> {
    const rows = await this.db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
    return (rows[0] as { roleId: number; userId: string }) || null;
  }

  async changeUserRole(
    userId: string,
    currentRoleId: number,
    newRoleId: number,
  ): Promise<{ roleId: number; userId: string } | null> {
    const updatedRows = await this.db
      .update(userRoles)
      .set({
        roleId: newRoleId,
      })
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, currentRoleId)))
      .returning();
    return (updatedRows[0] as { roleId: number; userId: string }) || null;
  }

  async findRolePermission(
    roleId: number,
    permissionId: number,
  ): Promise<{ roleId: number; permissionId: number } | null> {
    const rows = await this.db
      .select()
      .from(rolePermissions)
      .where(
        and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionId, permissionId)),
      );
    return (rows[0] as { roleId: number; permissionId: number }) || null;
  }

  async insertRolePermission(roleId: number, permissionId: number): Promise<void> {
    await this.db.insert(rolePermissions).values({ roleId, permissionId });
  }

  async findUserRoleIdsByUserId(userId: string): Promise<{ roleId: number }[]> {
    return this.db
      .select({ roleId: userRoles.roleId })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));
  }
}
