import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config.service';
import { validationSchema } from './validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Load different env files based on NODE_ENV
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? ['.env.test']
          : ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
      // Only load .env files if not in production
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      cache: false,
      validate: (config: Record<string, unknown>) => {
        const result = validationSchema.safeParse(config);
        if (!result.success) {
          throw new Error(`Config validation error: ${result.error.message}`);
        }
        return result.data;
      },
    }),
  ],

  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
