"use client";

import { useEffect, useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { DiaryEntry, DiaryStore } from "@/lib/types";
import { db } from "@/lib/db";
import { migrateFromLocalStorage } from "@/lib/migration";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function useDiaryStore() {
  // Try to migrate data on mount
  useEffect(() => {
    migrateFromLocalStorage();
  }, []);

  // Live query to get all entries
  const allEntries = useLiveQuery(() => db.entries.toArray());
  const isLoaded = allEntries !== undefined;

  // Transform array to Record<date, entries[]>
  const store = useMemo(() => {
    if (!allEntries) return {};
    const newStore: DiaryStore = {};
    for (const entry of allEntries) {
      if (!newStore[entry.date]) {
        newStore[entry.date] = [];
      }
      newStore[entry.date].push(entry);
    }
    // Sort entries for each day? Usually not needed if appended, but let's be safe
    // The previous implementation added to the end.
    return newStore;
  }, [allEntries]);

  const getEntries = useCallback(
    (date: string): DiaryEntry[] => store[date] ?? [],
    [store]
  );

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

  const getEntriesForMonth = useCallback(
    (year: number, month: number): DiaryEntry[] => {
      const prefix = `${year}-${String(month).padStart(2, "0")}`;
      if (!allEntries) return [];
      return allEntries
        .filter((e) => e.date.startsWith(prefix))
        .sort((a, b) => b.date.localeCompare(a.date));
    },
    [allEntries]
  );

  const hasEntry = useCallback(
    (date: string): boolean => (store[date]?.length ?? 0) > 0,
    [store]
  );

  const replaceStore = useCallback(async (newStore: DiaryStore) => {
    const entries = Object.values(newStore).flat();
    await db.transaction("rw", db.entries, async () => {
      await db.entries.clear();
      await db.entries.bulkAdd(entries);
    });
  }, []);

  const getStats = useCallback((): { dayCount: number; entryCount: number } => {
    if (!allEntries) return { dayCount: 0, entryCount: 0 };
    // Unique days
    const days = new Set(allEntries.map((e) => e.date));
    return { dayCount: days.size, entryCount: allEntries.length };
  }, [allEntries]);

  return {
    store,
    isLoaded,
    getEntries,
    addEntry,
    updateEntry,
    removeEntry,
    getEntriesForMonth,
    hasEntry,
    replaceStore,
    getStats,
  };
}
