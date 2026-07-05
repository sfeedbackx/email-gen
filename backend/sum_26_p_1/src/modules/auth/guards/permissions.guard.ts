import { UserWithPermissions } from '@modules/users/dto/users.dto';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';

/**
 * Guard factory that checks if the authenticated user has one of the required permissions.
 * @param requiredPermissions - The permissions that are allowed to access the route
 * @returns A guard class that can be used with @UseGuards decorator
 * @example @UseGuards(AuthGuard('jwt'), PermissionsGuard('read:users', 'write:users'))
 */
export const PermissionsGuard = (...requiredPermissions: string[]): Type<CanActivate> => {
  @Injectable()
  class PermissionsGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      // If no permissions are required, allow access
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
      }

      // Get the user from the request object (set by JwtAuthGuard)
      const request = context.switchToHttp().getRequest();
      const user = request.user as UserWithPermissions;

      if (!user) {
        return false;
      }

      // Check if the user has the required permissions
      // The permissions are included in the JWT payload
      const hasPermission = this.matchPermissions(requiredPermissions, user.permissions || []);

      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
      }

      return true;
    }

    private matchPermissions(required: string[], userPermissions: string[]): boolean {
      // Check if the user has at least one of the required permissions
      return required.some((permission) => userPermissions.includes(permission));
    }
  }

  return mixin(PermissionsGuardMixin);
};
