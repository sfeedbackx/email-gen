import { takeUniqueOrThrow } from '@database/drizzle/helper';
import { users } from '@database/drizzle/schema';
import { RolesRepository } from '@modules/roles/repository/roles.repository';
import { RolesService } from '@modules/roles/roles.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserWithPermissions } from './dto/users.dto';
import { UserRepository } from './repository/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly rolesService: RolesService,
    private readonly roleRepository: RolesRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createLocalUser(
    userData: Omit<typeof users.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<UserWithPermissions> {
    const guestRole = await this.roleRepository
      .getDefaultRole('USER')
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('User not found')),
      );
    const user = await this.userRepository
      .createUser({
        ...userData,
        userType: 'USER',
        authProvider: 'LOCAL',
      })
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('User not inserted')),
      );

    const guestUserRole = await this.rolesService.assignRoleToUser(user.id, guestRole.id);
    if (!guestUserRole) {
      throw new InternalServerErrorException('Failed to assign guest role');
    }

    const role = await this.rolesService.getUserRole(user.id);
    const permissions = await this.rolesService.getPermissionsForRole(guestRole.id);

    return {
      ...user,
      userAttributes: user.attributes,
      profilePicture: user.profilePicture ?? undefined,
      role: role ?? [],
      permissions: permissions.map((p) => p.name),
    };
  }

  async deleteAccount(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.deleteUser(userId);
  }
}
