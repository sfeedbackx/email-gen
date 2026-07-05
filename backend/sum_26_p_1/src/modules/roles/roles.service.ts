import { takeUniqueOrThrow } from '@database/drizzle/helper';
import { Permission } from '@modules/permissions/dto/permission.dto';
import { PermissionRepository } from '@modules/permissions/repository/permission.repository';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Role } from './dto/role.dto';
import { RolesRepository } from './repository/roles.repository';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async getPermissionsForRole(roleId: number): Promise<Permission[]> {
    return this.permissionRepository.getPermissionsForRole(roleId);
  }

  async addPermissionToRole(
    roleId: number,
    permissionId: number,
  ): Promise<{ success: boolean; message?: string }> {
    // Check if the role exists
    const role = await this.rolesRepository.findRoleById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Check if the permission exists
    const permissionExists = await this.permissionRepository.findPermissionById(permissionId);

    if (!permissionExists) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found`);
    }

    // Check if the role already has this permission
    const existingAssignment = await this.rolesRepository.findRolePermission(roleId, permissionId);

    if (existingAssignment) {
      // Permission already assigned
      return { success: true, message: 'Permission already assigned to role' };
    }

    // Add the permission to the role
    await this.rolesRepository.insertRolePermission(roleId, permissionId);

    return { success: true };
  }

  async getUserRole(userId: string): Promise<Role[] | null> {
    const roles = await this.rolesRepository.findUserRoles(userId);

    if (roles.length === 0) {
      return null;
    }
    const rolesUser: Role[] = [];
    for (const r of roles) {
      const foundRole = await this.rolesRepository
        .findRoleById(r.roleId)
        .then((value) =>
          takeUniqueOrThrow(value, new InternalServerErrorException('role not found')),
        );
      rolesUser.push({
        ...foundRole,
        description: foundRole.description ?? undefined,
        targetType: foundRole.targetType ?? undefined,
      });
    }
    return rolesUser;
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    // Get the user's role
    const role = await this.rolesRepository.findUserRoleIdsByUserId(userId);

    if (!role[0] || !role[0].roleId) {
      return [];
    }

    // Get all permissions for this role
    return this.getPermissionsForRole(role[0].roleId);
  }

  async assignRoleToUser(userId: string, roleId: number) {
    // Check if the role exists
    const role = await this.rolesRepository
      .findRoleById(roleId)
      .then((value) =>
        takeUniqueOrThrow(value, new NotFoundException('Role with this ID not found')),
      );

    const res = await this.rolesRepository
      .insertUserRole(userId, role.id)
      .then((value) =>
        takeUniqueOrThrow(
          value,
          new InternalServerErrorException('could not assign the role to the user'),
        ),
      );
    return res;
  }
  async updateGuestRoleUser(userId: string, roleId: number) {
    const role = await this.rolesRepository
      .getDefaultRole('GUEST')
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('Guest role not found')),
      );
    if (!role) {
    }
    const userRole = await this.rolesRepository.findUserRoleByRoleIdAndUserId(userId, role.id);
    if (!userRole) {
      throw new NotFoundException('User with guest Role not found');
    }
    const updatedUserRole = await this.rolesRepository.changeUserRole(userId, role.id, roleId);
    if (!updatedUserRole) {
      throw new InternalServerErrorException('Guest User not Updated');
    }
    return updatedUserRole;
  }
}
