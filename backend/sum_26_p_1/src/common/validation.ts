import z from 'zod';

// ─────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────

export const DefaultString = z.string().trim();
export const NullableString = DefaultString.nullable();
export const OptionalString = DefaultString.optional();

// UUID - for user id
export const UUIDSchema = z.uuid('UUID not valid').trim();

//number / Integer
export const IntegerPosSchema = z.int().positive('integer not positive');

export const NumberSchema = z.number();

// Name validator - for contact names, user first/last name
export const NameSchema = DefaultString.min(2, 'Name must be at least 2 characters').max(
  50,
  'Name must not exceed 50 characters',
);

// Email validator - for user account + contact email
export const EmailSchema = z
  .email('Please enter a valid email address')
  .trim()
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters');

// Password
export const PasswordSchema = DefaultString.min(8, 'Password must be at least 8 characters')
  .max(18, 'Password must not exceed 18 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
  );

// Confirm password
export const ConfirmPasswordSchema = DefaultString;

// Refresh token
export const RefreshTokenSchema = DefaultString.min(1, 'Refresh token is required').max(
  255,
  'Refresh token must not exceed 255 characters',
);

// Integer ID - for contacts, threads, messages, drafts, documents
export const IdIntSchema = z.preprocess((val) => {
  if (typeof val === 'string') return Number.parseInt(val, 10);
  if (typeof val === 'number') return val;
  return val;
}, z.number().int().positive('ID must be a positive integer'));

// Context - the AI instruction per contact
// e.g. "Strict, formal French, address as Professor Ahmed"
export const ContextSchema = DefaultString.min(2, 'Context must be at least 2 characters').max(
  1000,
  'Context must not exceed 1000 characters',
);

// Subject - thread subject line
export const SubjectSchema = DefaultString.min(2, 'Subject must be at least 2 characters').max(
  255,
  'Subject must not exceed 255 characters',
);

// Content - email message or draft body
export const ContentSchema = z.string().trim().min(1, 'Content is required');

// Prompt - what you tell the AI to write
// e.g. "Ask him politely why I lost points on question 3"
export const PromptSchema = DefaultString.min(5, 'Prompt must be at least 5 characters').max(
  500,
  'Prompt must not exceed 500 characters',
);

// Filename - document reference
export const FilenameSchema = DefaultString.min(1, 'Filename is required').max(
  255,
  'Filename must not exceed 255 characters',
);

// Description - user describes what the doc is
// e.g. "My CV updated Oct 2024"
export const DescriptionSchema = DefaultString.min(
  2,
  'Description must be at least 2 characters',
).max(500, 'Description must not exceed 500 characters');

// Language - per contact
export const LanguageSchema = z.enum(['en', 'fr'], 'Language must be either "en" or "fr"');
