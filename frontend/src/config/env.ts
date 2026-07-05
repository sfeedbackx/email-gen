import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.url().optional().default('/api'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', z.prettifyError(parsed.error));
  throw new Error('Invalid environment variables');
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
} as const;
