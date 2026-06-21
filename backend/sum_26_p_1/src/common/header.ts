import z from "zod";

export const HeaderKeyEnum = z.enum([
  'authorization',
  'accept-version',
  'x-app-version',
  'x-client-locale',
  'idempotency-key',
  'user-agent',
  'cache-control',
  'x-client-locale',
]);

export type HeaderKey = z.infer<typeof HeaderKeyEnum>;
