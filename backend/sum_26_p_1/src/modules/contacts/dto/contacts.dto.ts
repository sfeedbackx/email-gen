import { StandardResponseSchema } from '@common/pagination';
import {
  ContextSchema,
  DefaultString,
  EmailSchema,
  IdIntSchema,
  LanguageSchema,
  NameSchema,
  NullableString,
  OptionalString,
  UUIDSchema,
} from '@common/validation';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

export const CreateContactSchema = z.object({
  name: NameSchema,
  email: EmailSchema.optional(),
  context: ContextSchema.optional(),
  language: LanguageSchema,
});
export class CreateContactDto extends createZodDto(CreateContactSchema) {}
export type CreateContactType = z.infer<typeof CreateContactSchema>;

export const UpdateContactSchema = z
  .object({
    name: NameSchema.optional(),
    email: EmailSchema.optional(),
    context: ContextSchema.optional(),
    language: LanguageSchema.optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });
export class UpdateContactDto extends createZodDto(UpdateContactSchema) {}
export type UpdateContactType = z.infer<typeof UpdateContactSchema>;

export const ContactParamSchema = z.object({
  id: IdIntSchema,
});
export class ContactParamDto extends createZodDto(ContactParamSchema) {}
export type ContactParamType = z.infer<typeof ContactParamSchema>;

// ─────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────

export const ContactResponseSchema = z.object({
  id: IdIntSchema,
  userId: UUIDSchema,
  name: NameSchema,
  email: EmailSchema.optional(),
  context: NullableString,
  language: LanguageSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export class ContactResponseDto extends createZodDto(ContactResponseSchema) {}
export type ContactResponseType = z.infer<typeof ContactResponseSchema>;

export const ContactWithDetailsResponseSchema = ContactResponseSchema.extend({
  documents: z.array(
    z.object({
      id: IdIntSchema,
      filename: NameSchema,
      description: OptionalString,
      createdAt: z.date(),
    }),
  ),
  threads: z.array(
    z.object({
      id: IdIntSchema,
      subject: DefaultString,
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
});
export class ContactWithDetailsResponseDto extends createZodDto(ContactWithDetailsResponseSchema) {}
export type ContactWithDetailsResponseType = z.infer<typeof ContactWithDetailsResponseSchema>;

// ─────────────────────────────────────────────
// RESPONSE WRAPPERS
// ─────────────────────────────────────────────

export const ContactListResponseSchema = StandardResponseSchema(ContactResponseSchema);
export class ContactListResponseDto extends createZodDto(ContactListResponseSchema) {}
export type ContactListResponseType = z.infer<typeof ContactListResponseSchema>;

export const ContactSingleResponseSchema = StandardResponseSchema(ContactResponseSchema);
export class ContactSingleResponseDto extends createZodDto(ContactSingleResponseSchema) {}
export type ContactSingleResponseType = z.infer<typeof ContactSingleResponseSchema>;

export const ContactWithDetailsResponseWrapperSchema = StandardResponseSchema(
  ContactWithDetailsResponseSchema,
);
export class ContactWithDetailsResponseWrapperDto extends createZodDto(
  ContactWithDetailsResponseWrapperSchema,
) {}
export type ContactWithDetailsResponseWrapperType = z.infer<
  typeof ContactWithDetailsResponseWrapperSchema
>;
