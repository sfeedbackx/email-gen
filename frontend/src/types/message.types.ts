
export type MessageRole = 'ME' | 'CONTACT'

export interface MessageType {
  id: number
  threadId: number
  role: MessageRole
  content: string
  createdAt: Date
}
