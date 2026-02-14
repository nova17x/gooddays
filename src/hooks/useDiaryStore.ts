"use client";

import { useCallback } from "react";
import { db } from "@/lib/db";
import type { DiaryEntry, DiaryStore } from "@/lib/types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Rename to useDiaryActions to clarify intent, but export as useDiaryStore for partial compat if desired,
// though we are breaking the API anyway.
export function useDiaryActions() {
  const addEntry = useCallback(
    async (date: string, prompt: string, body: string) => {
      const entry: DiaryEntry = {
        id: generateId(),
        date,
        prompt,
        body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.entries.add(entry);
    },
    []
  );

  const updateEntry = useCallback(
    async (date: string, id: string, body: string) => {
      await db.entries.update(id, {
        body,
        updatedAt: new Date().toISOString(),
      });
    },
    []
  );

  const removeEntry = useCallback(async (date: string, id: string) => {
    await db.entries.delete(id);
  }, []);

  const replaceStore = useCallback(async (newStore: DiaryStore) => {
    const entries = Object.values(newStore).flat();
    await db.transaction("rw", db.entries, async () => {
      await db.entries.clear();
      await db.entries.bulkAdd(entries);
    });
  }, []);

  return {
    addEntry,
    updateEntry,
    removeEntry,
    replaceStore,
  };
}
