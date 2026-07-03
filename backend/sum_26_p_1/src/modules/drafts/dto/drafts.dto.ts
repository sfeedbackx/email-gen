import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  ContentSchema,
  PromptSchema,
  IdIntSchema,
  DefaultString,
  NullableString,
} from '@common/validation';
import { StandardResponseSchema } from '@common/pagination';

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

export const GenerateDraftSchema = z.object({
  prompt: PromptSchema,
});
export class GenerateDraftDto extends createZodDto(GenerateDraftSchema) { }
export type GenerateDraftType = z.infer<typeof GenerateDraftSchema>;

export const UpdateDraftSchema = z.object({
  content: ContentSchema,
});
export class UpdateDraftDto extends createZodDto(UpdateDraftSchema) { }
export type UpdateDraftType = z.infer<typeof UpdateDraftSchema>;

export const DraftParamSchema = z.object({
  contactId: IdIntSchema,
  threadId: IdIntSchema,
  id: IdIntSchema,
});
export class DraftParamDto extends createZodDto(DraftParamSchema) { }
export type DraftParamType = z.infer<typeof DraftParamSchema>;

export const PromoteDraftParamSchema = z.object({
  contactId: IdIntSchema,
  threadId: IdIntSchema,
  id: IdIntSchema,
});
export class PromoteDraftParamDto extends createZodDto(PromoteDraftParamSchema) { }
export type PromoteDraftParamType = z.infer<typeof PromoteDraftParamSchema>;

export const DraftThreatSchema = z.object({
  contactId: IdIntSchema,
  threadId: IdIntSchema,
});
export class DraftThreatDto extends createZodDto(DraftThreatSchema) { }

// ─────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────

export const DraftResponseSchema = z.object({
  id: IdIntSchema,
  threadId: IdIntSchema,
  content: DefaultString,
  prompt: NullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});
export class DraftResponseDto extends createZodDto(DraftResponseSchema) { }
export type DraftResponseType = z.infer<typeof DraftResponseSchema>;

// ─────────────────────────────────────────────
// RESPONSE WRAPPERS
// ─────────────────────────────────────────────

export const DraftListResponseSchema = StandardResponseSchema(DraftResponseSchema);
export class DraftListResponseDto extends createZodDto(DraftListResponseSchema) { }
export type DraftListResponseType = z.infer<typeof DraftListResponseSchema>;

export const DraftSingleResponseSchema = StandardResponseSchema(DraftResponseSchema);
export class DraftSingleResponseDto extends createZodDto(DraftSingleResponseSchema) { }
export type DraftSingleResponseType = z.infer<typeof DraftSingleResponseSchema>;
