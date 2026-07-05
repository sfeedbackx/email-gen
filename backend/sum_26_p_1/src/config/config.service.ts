import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './validation';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true });
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL', { infer: true });
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET', { infer: true });
  }

  get googleClientId(): string {
    return this.configService.get('GOOGLE_CLIENT_ID', { infer: true });
  }

  get googleClientSecret(): string {
    return this.configService.get('GOOGLE_CLIENT_SECRET', { infer: true });
  }
  get googleRedirectUrl(): string {
    return this.configService.get('GOOGLE_CALLBACK_URL', { infer: true });
  }
  get facebookClientId(): string {
    return this.configService.get('FACEBOOK_CLIENT_ID', { infer: true });
  }

  get facebookClientSecret(): string {
    return this.configService.get('FACEBOOK_CLIENT_SECRET', { infer: true });
  }
  get facebookRedirectUrl(): string {
    return this.configService.get('FACEBOOK_CALLBACK_URL', { infer: true });
  }
  get jwtExpiration(): number {
    return this.configService.get<number>('JWT_EXPIRATION', { infer: true }) || 24 * 60 * 60;
  }
  get maxAge(): number {
    return this.configService.get<number>('MAX_AGE', { infer: true }) || 7 * 24 * 60 * 60 * 1000;
  }
  get ollamaHost(): string {
    return this.configService.get<string>('OLLAMA_HOST') ?? 'http://localhost:11434';
  }

  get ollamaModel(): string {
    return this.configService.get<string>('OLLAMA_MODEL') ?? 'mistral';
  }
}
