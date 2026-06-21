import { z } from 'zod/v4';

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export enum PaginationQueryParam {
  page = 'page',
  limit = 'limit',
  sortBy = 'sortBy',
  sortOrder = 'sortOrder',
}

// ─────────────────────────────────────────────
// PRIMITIVE SCHEMAS
// ─────────────────────────────────────────────

export const PageSchema = z.preprocess(
  (val) => (typeof val === 'string' ? Number.parseInt(val, 10) : val),
  z.number().int().positive().default(1),
);

export const LimitSchema = z.preprocess(
  (val) => (typeof val === 'string' ? Number.parseInt(val, 10) : val),
  z.number().int().positive().max(100).default(10),
);

export const SortBySchema = z.string().trim().optional();

export const SortOrderSchema = z.enum(['ASC', 'DESC']).default('ASC');

// ─────────────────────────────────────────────
// PAGINATION QUERY
// ─────────────────────────────────────────────

export const PaginationQuerySchema = z.object({
  page: PageSchema,
  limit: LimitSchema,
  sortBy: SortBySchema,
  sortOrder: SortOrderSchema,
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

// ─────────────────────────────────────────────
// RESPONSE META
// ─────────────────────────────────────────────

export const ResponseMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  itemCount: z.number().int().nonnegative(),
  pageCount: z.number().int().nonnegative(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

export type ResponseMeta = z.infer<typeof ResponseMetaSchema>;

// ─────────────────────────────────────────────
// RESPONSE SCHEMAS (generic factories)
// ─────────────────────────────────────────────

export const StandardResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    data: schema,
    statusCode: z.number(),
    meta: z.record(z.string(), z.unknown()).optional(),
    message: z.string().optional(),
  });

export const PaginationResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    items: z.array(schema),
    meta: ResponseMetaSchema,
    statusCode: z.number(),
  });

export const ResponsesSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    data: z.array(schema),
    statusCode: z.number(),
  });

// Alias kept for back-compat
export const ResponsesListSchema = ResponsesSchema;

export const ErrorResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string().optional(),
});

export const ResponseWithMessageSchema = z.object({
  statusCode: z.number().positive().int(),
  message: z.string().trim(),
});

// ─────────────────────────────────────────────
// INFERRED TYPES
// ─────────────────────────────────────────────

export type StandardResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof StandardResponseSchema<T>>
>;

export type PaginationResponse<T extends z.ZodType> = z.infer<
typeof PaginationResponseSchema<T>
>;

export type ResponsesType<T extends z.ZodType> = z.infer<ReturnType<typeof ResponsesSchema<T>>>;

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export type MessageResponse = z.infer<typeof ResponseWithMessageSchema>;


// ─────────────────────────────────────────────
// PAGINATION UTILITIES
// ─────────────────────────────────────────────

export function createPaginationMeta(total: number, query: PaginationQuery): ResponseMeta {
  const { page, limit } = query;
  const pageCount = Math.ceil(total / limit);
  return {
    itemCount: total,
    page,
    limit,
    pageCount,
    hasNextPage: page < pageCount,
    hasPreviousPage: page > 1,
  };
}

export function createPaginatedResponse<T extends z.ZodType>(
  items: T[],
  total: number,
  query: PaginationQuery,
): PaginationResponse<T> {
  return { items, meta: createPaginationMeta(total, query) };
}

export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}
