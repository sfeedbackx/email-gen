import { AppConfigService } from '@config/config.service';
import { Inject, Provider } from '@nestjs/common';
import { Pool } from 'pg';

export const CONNECTION_PROVIDER_TOKEN = Symbol('CONNECTION_PROVIDER_TOKEN');

export const ConnectionProvider: Provider = {
  provide: CONNECTION_PROVIDER_TOKEN,
  inject: [AppConfigService],
  useFactory: async (configService: AppConfigService) => {
    const pool = new Pool({
      connectionString: configService.databaseUrl,
    });

    return pool;
  },
};

export const InjectConnection = () => Inject(CONNECTION_PROVIDER_TOKEN);
export const injectConnectionToken = () => CONNECTION_PROVIDER_TOKEN;
