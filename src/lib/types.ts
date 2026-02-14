export interface DiaryEntry {
  id: string;
  date: string;
  prompt: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  mood?: string;
}

export type DiaryStore = Record<string, DiaryEntry[]>;
