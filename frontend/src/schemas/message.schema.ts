import z from 'zod';

export const promptSchema = z.object({
  prompt: z.string().min(2, 'prompt too short'),
});

export type Prompt = z.infer<typeof promptSchema>;
export type PromptError = Partial<string>;

export const draftContentUpdateSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
});
export type DraftContentUpdate = z.infer<typeof draftContentUpdateSchema>;
