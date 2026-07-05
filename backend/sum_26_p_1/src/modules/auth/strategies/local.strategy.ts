import { UserWithPermissions } from '@modules/users/dto/users.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Validate the user credentials
   * @param email - Email address
   * @param password - Password
   * @returns User with permissions
   */
  async validate(email: string, password: string): Promise<UserWithPermissions> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('error.invalid_credential');
    }

    return user;
  }
}
