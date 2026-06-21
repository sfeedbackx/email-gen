import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ContentSchema, IdIntSchema } from '@common/validation';

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

export const CreateMessageSchema = z.object({
  role: z.enum(['ME', 'CONTACT']),
  content: ContentSchema,
});
export class CreateMessageDto extends createZodDto(CreateMessageSchema) {}
export type CreateMessageType = z.infer<typeof CreateMessageSchema>;

export const MessageParamSchema = z.object({
   contactId: IdIntSchema,
  threadId: IdIntSchema,
  id: IdIntSchema,
});
export class MessageParamDto extends createZodDto(MessageParamSchema) {}
export type MessageParamType = z.infer<typeof MessageParamSchema>;

// ─────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────

export const MessageResponseSchema = z.object({
  id: z.number(),
  threadId: z.number(),
  role: z.enum(['ME', 'CONTACT']),
  content: z.string(),
  createdAt: z.date(),
});
export class MessageResponseDto extends createZodDto(MessageResponseSchema) {}
export type MessageResponseType = z.infer<typeof MessageResponseSchema>;

// ─────────────────────────────────────────────
// RESPONSE WRAPPERS
// ─────────────────────────────────────────────

export const MessageListResponseSchema = z.object({
  data: z.array(MessageResponseSchema),
  statusCode: z.number(),
});
export class MessageListResponseDto extends createZodDto(MessageListResponseSchema) {}
export type MessageListResponseType = z.infer<typeof MessageListResponseSchema>;

export const MessageSingleResponseSchema = z.object({
  data: MessageResponseSchema,
  statusCode: z.number(),
});
export class MessageSingleResponseDto extends createZodDto(MessageSingleResponseSchema) {}
export type MessageSingleResponseType = z.infer<typeof MessageSingleResponseSchema>;
