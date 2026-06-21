import { StandardResponseSchema } from '@common/pagination';
import { DefaultString, DescriptionSchema, FilenameSchema, IdIntSchema } from '@common/validation';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

export const CreateDocumentSchema = z.object({
  filename: FilenameSchema,
  description: DescriptionSchema.optional(),
});
export class CreateDocumentDto extends createZodDto(CreateDocumentSchema) {}
export type CreateDocumentType = z.infer<typeof CreateDocumentSchema>;

export const UpdateDocumentSchema = z.object({
  filename: FilenameSchema.optional(),
  description: DescriptionSchema.optional(),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: 'At least one field must be provided' },
);
export class UpdateDocumentDto extends createZodDto(UpdateDocumentSchema) {}
export type UpdateDocumentType = z.infer<typeof UpdateDocumentSchema>;

export const DocumentParamSchema = z.object({
  contactId: IdIntSchema,
  id: IdIntSchema,
});
export class DocumentParamDto extends createZodDto(DocumentParamSchema) {}
export type DocumentParamType = z.infer<typeof DocumentParamSchema>;

// ─────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────

export const DocumentResponseSchema = z.object({
  id: IdIntSchema,
  contactId: IdIntSchema,
  filename: DefaultString,
  description: DescriptionSchema.optional(),
  createdAt: z.date(),
});
export class DocumentResponseDto extends createZodDto(DocumentResponseSchema) {}
export type DocumentResponseType = z.infer<typeof DocumentResponseSchema>;

// ─────────────────────────────────────────────
// RESPONSE WRAPPERS
// ─────────────────────────────────────────────

export const DocumentListResponseSchema = StandardResponseSchema(DocumentResponseSchema)
export class DocumentListResponseDto extends createZodDto(DocumentListResponseSchema) {}
export type DocumentListResponseType = z.infer<typeof DocumentListResponseSchema>;
export const DocumentSingleResponseSchema = StandardResponseSchema(DocumentResponseSchema)
export class DocumentSingleResponseDto extends createZodDto(DocumentSingleResponseSchema) {}
export type DocumentSingleResponseType = z.infer<typeof DocumentSingleResponseSchema>;
