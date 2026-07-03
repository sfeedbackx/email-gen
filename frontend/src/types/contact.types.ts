import type { LanguageOption } from "./enums"

export type Contact = {
  id: number,
  userId: string,
  name: string,
  email: string,
  context: string,
  language: LanguageOption,
  createdAt: string,
  updatedAt: string
}
