import { z } from 'zod';

export const validationSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('api'),
  API_VERSION: z.string().default('v1'),

  // Database
  DATABASE_URL: z.url(),
  DATABASE_SSL: z.coerce.boolean().default(false),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.coerce.number().default(86400),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.url(),

  // Facebook OAuth
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CALLBACK_URL: z.url().optional(),

  // Redis
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional(),
  REDIS_PASSWORD: z.string().optional(),

  OLLAMA_MODEL: z.string(),
  OLLAMA_HOST: z.string(),
});

export type EnvironmentVariables = z.infer<typeof validationSchema>;
