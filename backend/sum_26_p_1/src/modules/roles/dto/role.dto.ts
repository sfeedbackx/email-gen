import { DefaultString, IntegerPosSchema, NullableString, OptionalString } from '@common/validation';
import { UserTypeSchema } from '@modules/users/dto/users.enums';
import { z } from 'zod/v4';

// ─────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────


export const RoleSchema = z.object({
  id: IntegerPosSchema,
  name: DefaultString,
  targetType: UserTypeSchema.optional(),
  description: OptionalString,
});
export type Role = z.infer<typeof RoleSchema>;


export const RolePermissionSchema = z.object({
  id: IntegerPosSchema,
  roleId: IntegerPosSchema,
  permissionId: IntegerPosSchema,
  createdAt: z.date(),
});
export type RolePermission = z.infer<typeof RolePermissionSchema>;
