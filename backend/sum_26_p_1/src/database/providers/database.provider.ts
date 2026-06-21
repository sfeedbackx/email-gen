import { Inject, Provider } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../drizzle/schema';
import { injectConnectionToken } from './connection.provider';

export const DATABASE_PROVIDER_TOKEN = Symbol('DATABASE_PROVIDER_TOKEN');

export const DatabaseProvider: Provider = {
  provide: DATABASE_PROVIDER_TOKEN,
  inject: [injectConnectionToken()],
  useFactory: async (pool: Pool) => {
    const db = drizzle(pool, {
      schema,
      logger: true,
    });

    return db;
  },
};

export const InjectDB = () => Inject(DATABASE_PROVIDER_TOKEN);
export const injectDbToken = () => DATABASE_PROVIDER_TOKEN;

export type DatabaseContext = NodePgDatabase<typeof schema>;
