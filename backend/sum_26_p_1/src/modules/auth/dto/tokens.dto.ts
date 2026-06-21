import { DefaultString, EmailSchema, IntegerPosSchema, NullableString, NumberSchema, OptionalString } from '@common/validation';
import { RoleSchema } from '@modules/roles/dto/role.dto';
import { AuthProviderSchema, UserAttributesSchema, UserTypeSchema } from '@modules/users/dto/users.enums';
import z from 'zod';
export const JwtPayloadSchema = z.object({
  sub: z.string(),
  email: EmailSchema,
  firstName: NullableString,
  lastName: NullableString,
  authProvider: AuthProviderSchema,
  userAttributes: UserAttributesSchema,
  type: UserTypeSchema,
  role: z.array(RoleSchema).optional(),
  permissions: z.array(DefaultString).optional(),
  iat: NumberSchema.optional(),
  exp: NumberSchema.optional(),
});
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const RefreshTokenSchema = z.object({
  id: IntegerPosSchema,
  userId: DefaultString,
  token: DefaultString,
  expiresAt: z.date(),
  createdAt: z.date(),
  revokedAt: z.date().optional(),
  replacedByToken: OptionalString,
  userAgent: DefaultString,
  ipAddress: z.ipv4(),
});
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
