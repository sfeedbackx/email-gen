/*import { GoogleFacebookUser } from '@common/types/auth.types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile, Strategy, VerifyFunction, VerifyFunctionWithRequest } from 'passport-facebook';

import { z } from 'zod';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID') as string,
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET') as string,
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL') as string,
      scope: ['email'],
      profileFields: ['id', 'emails'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Parameters<VerifyFunctionWithRequest>[4],
  ): Promise<void> {
    // define a zod schema for the profile object
    const profileSchema = z.object({
      id: z.string(),
      emails: z.array(z.object({ value: z.string() })),
    });

    try {
      const { id, emails } = profileSchema.parse(profile);

      const user: GoogleFacebookUser = {
        providerId: id,
        email: emails[0].value,
        accessToken,
      };

      done(null, user);
    } catch (error) {
      throw new BadRequestException('Invalid profile');
    }
  }
}*/
