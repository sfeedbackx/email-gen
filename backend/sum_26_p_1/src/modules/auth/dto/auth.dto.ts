import {
  ConfirmPasswordSchema,
  DefaultString,
  EmailSchema,
  NameSchema,
  PasswordSchema,
} from '@common/validation';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────

export const RegisterSchema = z
  .object({
    firstName: NameSchema,
    lastName: NameSchema,
    email: EmailSchema,
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    dateOfBirth: z.string('Date of birth must be a valid date'),
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export class RegisterDto extends createZodDto(RegisterSchema) {}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export class LoginDto extends createZodDto(LoginSchema) {}

// ─────────────────────────────────────────────
// Logout
// ─────────────────────────────────────────────
export const LogoutResponseSchema = z.object({
  message: DefaultString,
});

export class LogoutDto extends createZodDto(LogoutResponseSchema) {}

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}
