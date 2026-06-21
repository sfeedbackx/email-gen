import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationException } from 'nestjs-zod';
import { LoginSchema } from '../dto/auth.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body || {};
    const result = LoginSchema.safeParse({ email, password });

    // Validate request body before calling Passport
    if (!result.success) {
      throw new ZodValidationException(result.error);
    }

    // Proceed with Passport authentication
    return await (super.canActivate(context) as Promise<boolean>);
  }
}
