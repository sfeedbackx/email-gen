import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { SubjectSchema, IdIntSchema, DefaultString, NullableString } from '@common/validation';
import { ResponsesSchema, StandardResponseSchema } from '@common/pagination';

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

export const CreateThreadSchema = z.object({
  subject: SubjectSchema,
});
export class CreateThreadDto extends createZodDto(CreateThreadSchema) { }
export type CreateThreadType = z.infer<typeof CreateThreadSchema>;

export const UpdateThreadSchema = z.object({
  subject: SubjectSchema,
});
export class UpdateThreadDto extends createZodDto(UpdateThreadSchema) { }
export type UpdateThreadType = z.infer<typeof UpdateThreadSchema>;

export const ContactParamSchema = z.object({
  contactId: IdIntSchema,
});
export class ContactParamDto extends createZodDto(ContactParamSchema) {}
export type ContactParamType = z.infer<typeof ContactParamSchema>;

export const ThreadParamSchema = z.object({
  contactId: IdIntSchema,
  id: IdIntSchema,
});

export class ThreadParamDto extends createZodDto(ThreadParamSchema) { }
export type ThreadParamType = z.infer<typeof ThreadParamSchema>;

// ─────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────

export const ThreadResponseSchema = z.object({
  id: IdIntSchema,
  contactId: IdIntSchema,
  subject: DefaultString,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export class ThreadResponseDto extends createZodDto(ThreadResponseSchema) { }
export type ThreadResponseType = z.infer<typeof ThreadResponseSchema>;

export const ThreadWithDetailsResponseSchema = ThreadResponseSchema.extend({
  messages: z.array(
    z.object({
      id: IdIntSchema,
      role: z.enum(['ME', 'CONTACT']),
      content: DefaultString,
      createdAt: z.date(),
    }),
  ),
  drafts: z.array(
    z.object({
      id: IdIntSchema,
      content: DefaultString,
      prompt: NullableString,
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
});
export class ThreadWithDetailsResponseDto extends createZodDto(ThreadWithDetailsResponseSchema) { }
export type ThreadWithDetailsResponseType = z.infer<typeof ThreadWithDetailsResponseSchema>;

// ─────────────────────────────────────────────
// RESPONSE WRAPPERS
// ─────────────────────────────────────────────

export const ThreadListResponseSchema = ResponsesSchema(ThreadResponseSchema);
export class ThreadListResponseDto extends createZodDto(ThreadListResponseSchema) { }
export type ThreadListResponseType = z.infer<typeof ThreadListResponseSchema>;

export const ThreadSingleResponseSchema = StandardResponseSchema(ThreadResponseSchema);
export class ThreadSingleResponseDto extends createZodDto(ThreadSingleResponseSchema) { }
export type ThreadSingleResponseType = z.infer<typeof ThreadSingleResponseSchema>;

export const ThreadWithDetailsResponseWrapperSchema = StandardResponseSchema(
  ThreadWithDetailsResponseSchema,
);
export class ThreadWithDetailsResponseWrapperDto extends createZodDto(
  ThreadWithDetailsResponseWrapperSchema,
) { }
export type ThreadWithDetailsResponseWrapperType = z.infer<
  typeof ThreadWithDetailsResponseWrapperSchema
>;
