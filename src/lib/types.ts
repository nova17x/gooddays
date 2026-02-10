export interface DiaryEntry {
  date: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export type DiaryStore = Record<string, DiaryEntry>;
