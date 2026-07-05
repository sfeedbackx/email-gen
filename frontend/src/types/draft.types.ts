export interface Draft {
  id: number;
  threadId: number;
  content: string;
  prompt: string | null;
  createdAt: Date;
  updatedAt: Date;
}
