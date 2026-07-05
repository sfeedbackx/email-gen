import type { Config } from 'drizzle-kit';
import z from 'zod';

const databaseUrl = z.url().trim();
const result = databaseUrl.safeParse(process.env.DATABASE_URL);

if (!result.success) {
  throw new Error(`Database URL validation failed: ${result.error.message}`);
}

export default {
  schema: './src/database/drizzle/schema/index.ts',
  dialect: 'postgresql',
  out: './src/database/drizzle/migrations',
  dbCredentials: { url: result.data },
  verbose: true,
  strict: true,
} satisfies Config;
