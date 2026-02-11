"use client";

import { useState, useEffect, useCallback } from "react";
import type { DiaryEntry, DiaryStore } from "@/lib/types";
import { STORAGE_KEY } from "@/lib/constants";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function useDiaryStore() {
  const [store, setStore] = useState<DiaryStore>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const migrated: DiaryStore = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (Array.isArray(value)) {
            migrated[key] = value as DiaryEntry[];
          } else if (
            typeof value === "object" &&
            value !== null &&
            "body" in value
          ) {
            const old = value as {
              date: string;
              body: string;
              createdAt: string;
              updatedAt: string;
            };
            migrated[key] = [
              {
                id: generateId(),
                date: old.date,
                prompt: "",
                body: old.body,
                createdAt: old.createdAt,
                updatedAt: old.updatedAt,
              },
            ];
          }
        }
        setStore(migrated);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  }, [store, isLoaded]);

  const getEntries = useCallback(
    (date: string): DiaryEntry[] => store[date] ?? [],
    [store]
  );

  const addEntry = useCallback(
    (date: string, prompt: string, body: string) => {
      const entry: DiaryEntry = {
        id: generateId(),
        date,
        prompt,
        body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setStore((prev) => ({
        ...prev,
        [date]: [...(prev[date] ?? []), entry],
      }));
    },
    []
  );

  const updateEntry = useCallback(
    (date: string, id: string, body: string) => {
      setStore((prev) => ({
        ...prev,
        [date]: (prev[date] ?? []).map((e) =>
          e.id === id
            ? { ...e, body, updatedAt: new Date().toISOString() }
            : e
        ),
      }));
    },
    []
  );

  const removeEntry = useCallback((date: string, id: string) => {
    setStore((prev) => {
      const entries = (prev[date] ?? []).filter((e) => e.id !== id);
      if (entries.length === 0) {
        const next = { ...prev };
        delete next[date];
        return next;
      }
      return { ...prev, [date]: entries };
    });
  }, []);

  const getEntriesForMonth = useCallback(
    (year: number, month: number): DiaryEntry[] => {
      const prefix = `${year}-${String(month).padStart(2, "0")}`;
      return Object.values(store)
        .flat()
        .filter((e) => e.date.startsWith(prefix))
        .sort((a, b) => b.date.localeCompare(a.date));
    },
    [store]
  );

  const hasEntry = useCallback(
    (date: string): boolean => (store[date]?.length ?? 0) > 0,
    [store]
  );

  const replaceStore = useCallback((newStore: DiaryStore) => {
    setStore(newStore);
  }, []);

  const getStats = useCallback((): { dayCount: number; entryCount: number } => {
    const days = Object.keys(store).filter(
      (key) => store[key] && store[key].length > 0
    );
    const entries = days.reduce((sum, key) => sum + store[key].length, 0);
    return { dayCount: days.length, entryCount: entries };
  }, [store]);

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
