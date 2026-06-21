import { takeUniqueOrThrow } from '@database/drizzle/helper';
import { Permission } from '@modules/permissions/dto/permission.dto';
import { RolesService } from '@modules/roles/roles.service';
import { UserWithPermissions } from '@modules/users/dto/users.dto';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@modules/users/repository/users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/auth.dto';
import { JwtPayload } from './dto/tokens.dto';
import { RefreshProvider } from './providers/refresh/refresh.service';
import { Role } from '@modules/roles/dto/role.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private refreshTokenProvider: RefreshProvider,
    private rolesService: RolesService,
    private userRepository: UserRepository,
  ) { }

  async validateUser(email: string, password: string): Promise<UserWithPermissions | null> {
    const user = await this.userRepository.findByEmail(email).then((value) => value[0]);

    if (!user || user.authProvider !== 'LOCAL') {
      return null;
    }

    const isPasswordValid = user.password && (await this.validatePassword(password, user.password));

    if (!isPasswordValid) {
      return null;
    }

    // Remove sensitive info
    const { password: _, ...userWithoutPassword } = user;

    const permissions: Permission[] | [] = await this.rolesService.getUserPermissions(user.id);
    const role = await this.rolesService.getUserRole(user.id);
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
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      userAttributes: userWithoutPassword.attributes,
      role: userRole,
      userType: userWithoutPassword.userType,
      permissions: permissions.map((p) => p.name),
    };
  }

  async login(
    user: UserWithPermissions,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResponse> {
    return this.generateAuthTokens(user, ipAddress, userAgent);
  }

  async refreshTokens(
    refreshToken: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResponse> {
    // Validate the refresh token
    const tokenDoc = await this.refreshTokenProvider.validateRefreshToken(refreshToken);

    // Get the user
    const user = await this.userRepository
      .findById(tokenDoc.userId)
      .then((value) => takeUniqueOrThrow(value, new UnauthorizedException('User Not Found')));

    // Generate new tokens
    const { password: _, ...userWithoutPassword } = user;

    // Get permissions
    const permissions = await this.rolesService.getUserPermissions(user.id);
    const role = await this.rolesService.getUserRole(user.id);

    let userRole: Role[] | undefined;
    if (role !== null) {
      userRole = [...role];
    }

    const userWithPermissions: UserWithPermissions = {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      firstName: userWithoutPassword.firstName,
      lastName: userWithoutPassword.lastName,
      providerId: userWithoutPassword.providerId,
      authProvider: userWithoutPassword.authProvider,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      userAttributes: userWithoutPassword.attributes,
      role: userRole,
      userType: userWithoutPassword.userType,
      permissions: permissions.map((p) => p.name),
    };

    // Replace the old refresh token with a new one
    const newRefreshToken = await this.refreshTokenProvider.replaceRefreshToken(
      tokenDoc.id,
      user.id,
      ipAddress,
      userAgent,
    );

    // Generate a new access token
    const accessToken = await this.generateAccessToken(userWithPermissions);

    return {
      accessToken,
      refreshToken: newRefreshToken.token,
    };
  }

  // Google & Facebook
  /*async googleLogin(
    locale: string,
    googleUser: GoogleFacebookUser,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResponse> {
    // Create or update user from Google profile
    const user = await this.usersService.createOrUpdateGoogleUser(
      locale,
      googleUser.email,
      googleUser.providerId,
    );

    // Get permissions
    const permissions: Permission[] = await this.rolesService.getUserPermissions(user.id);
    const role = await this.rolesService.getUserRole(user.id);

    let userRole: UserRole[] | undefined;
    if (role !== null) {
      userRole = [...role];
    }
    const userWithPermissions: UserWithPermissions = {
      ...user,
      providerId: user.providerId,
      userAttributes: {
        onboardingComplete: user?.attributes?.onboardingComplete || false,
      },
      role: userRole,
      permissions: permissions.map((p) => p.name),
      profilePicture: user.profilePicture ?? undefined,
    };

    return this.generateAuthTokens(userWithPermissions, ipAddress, userAgent);
  }

  async facebookLogin(
    locale: string,
    facebookUser: GoogleFacebookUser,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResponse> {
    // Create or update user from Facebook profile
    const user = await this.usersService.createOrUpdateFacebookUser(
      locale,
      facebookUser.email,
      facebookUser.providerId,
    );

    // Get permissions
    const permissions: Permission[] = await this.rolesService.getUserPermissions(user.id);
    const role = await this.rolesService.getUserRole(user.id);

    let userRole: UserRole[] | undefined;
    if (role !== null) {
      userRole = [...role];
    }
    const userWithPermissions: UserWithPermissions = {
      ...user,
      providerId: user.providerId,
      userAttributes: {
        onboardingComplete: user?.attributes?.onboardingComplete || false,
      },
      role: userRole,
      permissions: permissions.map((p) => p.name),
      profilePicture: user.profilePicture ?? undefined,
    };

    return this.generateAuthTokens(userWithPermissions, ipAddress, userAgent);
  }*/

  async logout(refreshToken: string): Promise<void> {
    // Find the token
    try {
      const tokenDoc = await this.refreshTokenProvider.validateRefreshToken(refreshToken);

      // Revoke the token
      await this.refreshTokenProvider.revokeRefreshToken(tokenDoc.id);
    } catch (error) {
      console.error(error);
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenProvider.revokeAllUserRefreshTokens(userId);
  }

  private async generateAccessToken(user: UserWithPermissions): Promise<string> {
    const roleUser: Role[] | undefined = user.role?.map((role) => ({
      id: role.id,
      name: role.name,
    }));
    // Build the JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      type: user?.userType || undefined,
      authProvider: user.authProvider,
      userAttributes: user.userAttributes,
      role: roleUser,
      permissions: user.permissions,
    };

    return this.jwtService.sign(payload);
  }

  private async generateAuthTokens(
    user: UserWithPermissions,
    ipAddress: string,
    userAgent: string,
  ): Promise<AuthResponse> {
    // Generate access token
    const accessToken = await this.generateAccessToken(user);

    // Generate refresh token
    const refreshTokenDoc = await this.refreshTokenProvider.generateRefreshToken(
      user.id,
      ipAddress,
      userAgent,
    );

    return {
      accessToken,
      refreshToken: refreshTokenDoc.token,
    };
  }
  async hashPassword(password: string): Promise<string> {
    const SALT = 12;
    return await bcrypt.hash(password, SALT);
  }
  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
