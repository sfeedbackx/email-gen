import z from 'zod';

export const loginFormSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
export type LoginFormErrors = Partial<Record<keyof LoginForm, string>>;

export const signupSchema = z
  .object({
    firstName: z.string().min(2, 'First name too short'),
    lastName: z.string().min(2, 'Last name too short'),
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Min 8 characters'),
    confirmPassword: z.string(),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['MALE', 'FEMALE']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignupForm = z.infer<typeof signupSchema>;
export type SignupFormErrors = Partial<Record<keyof SignupForm, string>>;
