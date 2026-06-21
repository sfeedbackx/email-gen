import { DefaultString, IntegerPosSchema, NullableString } from '@common/validation';
import z from 'zod';

export const PermissionSchema = z.object({
  id: IntegerPosSchema,
  name: DefaultString,
  resource: DefaultString,
  action: DefaultString,
  description: NullableString,
  createdAt: z.date(),
});
export type Permission = z.infer<typeof PermissionSchema>;
