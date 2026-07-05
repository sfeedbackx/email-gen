import { UserWithPermissions } from '@modules/users/dto/users.dto';
import { UserType } from '@modules/users/dto/users.enums';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Guard factory that checks if the authenticated user has one of the required user types.
 * @param requiredUserTypes - The user types that are allowed to access the route
 * @returns A guard class that can be used with @UseGuards decorator
 * @example @UseGuards(AuthGuard('jwt'), UserTypeGuard('PATIENT', 'PROFESSIONAL'))
 */
export const UserTypeGuard = (...requiredUserTypes: UserType[]): Type<CanActivate> => {
  @Injectable()
  class UserTypeGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      if (!requiredUserTypes || requiredUserTypes.length === 0) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user as UserWithPermissions;

      if (!user || !user.userType) {
        throw new UnauthorizedException('error.unauthorized');
      }

      const hasRequiredUserType: boolean = requiredUserTypes.includes(user.userType);
      if (!hasRequiredUserType) {
        throw new ForbiddenException('error.user_type_not_allowed');
      }

      return true;
    }
  }

  return mixin(UserTypeGuardMixin);
};
