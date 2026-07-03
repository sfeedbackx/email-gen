import z from "zod"

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'full name is too short'),
  email: z.email('Invalid email').trim(),
  context: z.string().trim().optional(),
  language: z.enum(['fr', 'en']).default('en'),
})

export type ContactForm = z.infer<typeof contactFormSchema>
export type ContactFormErrors = Partial<Record<keyof ContactForm, string>>
