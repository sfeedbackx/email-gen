import { AppConfigService } from '@config/config.service';
import { takeUniqueOrThrow } from '@database/drizzle/helper';
import { RolesService } from '@modules/roles/roles.service';
import {  UserWithPermissions } from '@modules/users/dto/users.dto';
import { UserRepository } from '@modules/users/repository/users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dto/tokens.dto';
import { Role } from '@modules/roles/dto/role.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: AppConfigService,
    private readonly rolesService: RolesService,
    private readonly userRepository: UserRepository,
  ) {
    const secretKey = configService.jwtSecret;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  /**
   * Validates the JWT payload and returns the user if valid
   */
  async validate(payload: JwtPayload): Promise<UserWithPermissions> {
    // payload is what we include in the JWT token
    // It contains user id, email, role, and permissions
    const user = await this.userRepository.findById(payload.sub).then((value) => takeUniqueOrThrow(
      value,
     new UnauthorizedException('User not found or not active')
    ));


    // Remove sensitive information and build UserWithPermissions
    const { password, ...userWithoutPassword } = user;

    const role = await this.rolesService.getUserRole(user.id);
    // Add role and permissions from the JWT payload
    // This avoids additional DB lookups
    let userRole: Role[] | undefined;
    if (role !== null) {
      userRole = [...role];
    }
    return {
      id: userWithoutPassword.id,
      firstName: userWithoutPassword.firstName,
      lastName: userWithoutPassword.lastName,
      providerId: userWithoutPassword.providerId,
      email: userWithoutPassword.email,
      authProvider: userWithoutPassword.authProvider,
      userAttributes: userWithoutPassword.attributes,

      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      role: userRole,
      userType: payload.type,
      permissions: payload.permissions || [],
    };
  }
}
