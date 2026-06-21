import { users } from '@database/drizzle/schema';
import { RolesRepository } from '@modules/roles/repository/roles.repository';
import { RolesService } from '@modules/roles/roles.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserWithPermissions } from './dto/users.dto';
import { UserRepository } from './repository/users.repository';
import { takeUniqueOrThrow } from '@database/drizzle/helper';

@Injectable()
export class UsersService {
  constructor(
    private readonly rolesService: RolesService,
    private readonly roleRepository: RolesRepository,
    private readonly userRepository: UserRepository,
  ) { }

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
      userAttributes : user.attributes,
      profilePicture : user.profilePicture ?? undefined,
      role: role ?? [],
      permissions: permissions.map((p) => p.name),
    };
  }

  // FACEBOOK and  GOOGLE method

  /* async createOrUpdateGoogleUser(email: string, providerId: string) {
    const existingUser = await this.userRepository.findByEmail(email).then((value) => value[0]);

    if (existingUser) {
      return this.userRepository.updateUser(existingUser.id, {
        authProvider: 'GOOGLE',
        providerId,
      });
    }

    const guestRole = await this.roleRepository
      .getDefaultRole('GUEST')
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('GuestRole not found')),
      );

    const newUser = await this.userRepository
      .createUser({
        email,
        authProvider: 'GOOGLE',
        providerId,
        userType: 'GUEST',
      })
      .then((value) =>
        takeUniqueOrThrow(value, new InternalServerErrorException('User not inserted')),
      );

    const guestUserRole = await this.rolesService.assignRoleToUser(newUser.id, guestRole.id);
    if (!guestUserRole) {
      throw new InternalServerErrorException('Failed to assign guest role');
    }

    return newUser;
  }

  async createOrUpdateFacebookUser(email: string, providerId: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      return this.userRepository.updateUser(existingUser.id, {
        authProvider: 'FACEBOOK',
        providerId,
      });
    }

    const guestRole = await this.roleRepository.getDefaultRole('GUEST');
    if (!guestRole) {
      throw new InternalServerErrorException('GuestRole not found');
    }

    const newUser = await this.userRepository.createUser({
      email,
      authProvider: 'FACEBOOK',
      providerId,
      userType: 'GUEST',
    });

    const guestUserRole = await this.rolesService.assignRoleToUser(newUser.id, guestRole.id);
    if (!guestUserRole) {
      throw new InternalServerErrorException('Failed to assign guest role');
    }

    return newUser;
  }*/

  // update User

  /*async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      gender?: string;
      dateOfBirth?: string;
      profilePicture?: string;
    },
  ) {
    const user = await this.userRepository.findById(userId).then((value) => takeUniqueOrThrow(
      value,
       new NotFoundException('User not found')
    ));

    const updated = await this.userRepository.updateUser(userId, {
      ...data,
      ...(user.userType === 'GUEST' && { userType: 'USER' }),
    });

    if (user.userType === 'GUEST') {
      const userRole = await this.roleRepository.getDefaultRole('USER');
      if (userRole) {
        await this.rolesService.updateGuestRoleUser(userId, userRole.id);
      }
    }

    return updated;
  }*/

  async deleteAccount(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.deleteUser(userId);
  }
}
