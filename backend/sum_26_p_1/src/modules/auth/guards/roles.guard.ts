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
 * Guard factory that checks if the authenticated user has one of the required roles.
 * @param requiredRoles - The roles that are allowed to access the route
 * @returns A guard class that can be used with @UseGuards decorator
 * @example @UseGuards(AuthGuard('jwt'), RolesGuard('admin', 'moderator'))
 */
export const RolesGuard = (...requiredRoles: string[]): Type<CanActivate> => {
  @Injectable()
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      // If no roles are required, allow access
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      // Get the user from the request object (set by JwtAuthGuard)
      const request = context.switchToHttp().getRequest();
      const user = request.user as UserWithPermissions;

      if (!user || !user.role) {
        return false;
      }

      // Check if the user's role is in the required roles
      let hasRole: boolean = user.role.length !== 0;
      let i = 0;
      while (hasRole && i < requiredRoles.length) {
        const existed = user.role.filter((r) => r.name === requiredRoles[i]);
        hasRole = existed.length !== 0;
        i++;
      }
      if (!hasRole) {
        throw new ForbiddenException('Insufficient role permissions');
      }

      return true;
    }
  }

  return mixin(RolesGuardMixin);
};
