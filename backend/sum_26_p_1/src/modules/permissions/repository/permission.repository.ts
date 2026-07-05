import { permissions, rolePermissions } from '@database/drizzle/schema/users.schema';
import { type DatabaseContext, InjectDB } from '@database/providers/database.provider';
import { Injectable } from '@nestjs/common';
import { eq, SQL } from 'drizzle-orm';
import { Permission } from '../dto/permission.dto';

@Injectable()
export class PermissionRepository {
  constructor(@InjectDB() private readonly db: DatabaseContext) {}

  async getPermissionsForRole(roleId: number): Promise<Permission[]> {
    const result = await this.db
      .select({
        id: permissions.id,
        name: permissions.name,
        description: permissions.description,
        action: permissions.action,
        resource: permissions.resource,
        createdAt: permissions.createdAt,
      })
      .from(rolePermissions)
      .innerJoin(
        permissions as unknown as SQL<unknown>,
        eq(rolePermissions.permissionId, permissions.id),
      )
      .where(eq(rolePermissions.roleId, roleId));

    return result;
  }
  async findPermissionById(id: number): Promise<Permission | null> {
    const result = await this.db.select().from(permissions).where(eq(permissions.id, id));
    return result[0] || null;
  }
}
