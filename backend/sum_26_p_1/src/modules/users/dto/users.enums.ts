import z from 'zod';

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export const AuthProviderSchema = z.enum(['LOCAL', 'GOOGLE', 'FACEBOOK', 'APPLE']);
export type AuthProvider = z.infer<typeof AuthProviderSchema>;

export const UserTypeSchema = z.enum(['ADMIN', 'USER', 'GUEST']);
export type UserType = z.infer<typeof UserTypeSchema>;

export const UserAttributesSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);
export type UserAttributes = z.infer<typeof UserAttributesSchema>;
