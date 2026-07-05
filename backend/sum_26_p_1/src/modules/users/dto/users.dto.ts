import { EmailSchema, NullableString, OptionalString, UUIDSchema } from '@common/validation';
import { RoleSchema } from '@modules/roles/dto/role.dto';
import { z } from 'zod/v4';
import { AuthProviderSchema, UserAttributesSchema, UserTypeSchema } from './users.enums';

export const UserSchema = z.object({
  id: UUIDSchema,
  email: EmailSchema,
  password: OptionalString,
  firstName: NullableString,
  lastName: NullableString,
  userAttributes: UserAttributesSchema,
  userType: UserTypeSchema,
  profilePicture: OptionalString,
  authProvider: AuthProviderSchema,
  providerId: NullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

export const UserWithPermissionsSchema = UserSchema.omit({ password: true }).extend({
  role: z.array(RoleSchema).optional(),
  permissions: z.array(z.string()),
});
export type UserWithPermissions = z.infer<typeof UserWithPermissionsSchema>;
