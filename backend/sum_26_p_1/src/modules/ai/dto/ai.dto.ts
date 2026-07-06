import { StandardResponseSchema } from '@common/pagination';
import { PromptSchema } from '@common/validation';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

export const GenerateEmailSchema = z.object({
  user: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
  }),
  contact: z.object({
    name: z.string(),
    email: z.string().nullable(),
    context: z.string().nullable(),
    language: z.enum(['en', 'fr']),
  }),
  thread: z.object({
    subject: z.string(),
  }),
  messages: z.array(
    z.object({
      role: z.enum(['ME', 'CONTACT']),
      content: z.string(),
    }),
  ),
  prompt: PromptSchema,
  documents: z
    .array(
      z.object({
        filename: z.string(),
        description: z.string().nullable(),
      }),
    )
    .optional(),
});
export class GenerateEmailDto extends createZodDto(GenerateEmailSchema) {}
export type GenerateEmailType = z.infer<typeof GenerateEmailSchema>;

export const RefineEmailSchema = z.object({
  content: z.string(),
  prompt: PromptSchema,
});
export class RefineEmailDto extends createZodDto(RefineEmailSchema) {}
export type RefineEmailType = z.infer<typeof RefineEmailSchema>;

// ─────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────

export const AiResponseSchema = z.object({
  content: z.string(),
});
export class AiResponseDto extends createZodDto(AiResponseSchema) {}
export type AiResponseType = z.infer<typeof AiResponseSchema>;

export const AiStatusResponseSchema = z.object({
  running: z.boolean(),
  model: z.string(),
});
export class AiStatusResponseDto extends createZodDto(AiStatusResponseSchema) {}
export type AiStatusResponseType = z.infer<typeof AiStatusResponseSchema>;

// ─────────────────────────────────────────────
// RESPONSE WRAPPERS
// ─────────────────────────────────────────────

export const AiResponseWrapperSchema = StandardResponseSchema(AiResponseSchema);
export class AiResponseWrapperDto extends createZodDto(AiResponseWrapperSchema) {}
export type AiResponseWrapperType = z.infer<typeof AiResponseWrapperSchema>;

export const AiStatusResponseWrapperSchema = StandardResponseSchema(AiStatusResponseSchema);
export class AiStatusResponseWrapperDto extends createZodDto(AiStatusResponseWrapperSchema) {}
export type AiStatusResponseWrapperType = z.infer<typeof AiStatusResponseWrapperSchema>;
