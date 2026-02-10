"use client";

import { useState, useEffect, useCallback } from "react";
import type { DiaryEntry, DiaryStore } from "@/lib/types";
import { STORAGE_KEY } from "@/lib/constants";

export function useDiaryStore() {
  const [entries, setEntries] = useState<DiaryStore>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const getEntry = useCallback(
    (date: string): DiaryEntry | undefined => entries[date],
    [entries]
  );

  const upsertEntry = useCallback((date: string, body: string) => {
    setEntries((prev) => ({
      ...prev,
      [date]: {
        date,
        body,
        createdAt: prev[date]?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const removeEntry = useCallback((date: string) => {
    setEntries((prev) => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  }, []);

  const getEntriesForMonth = useCallback(
    (year: number, month: number): DiaryEntry[] => {
      const prefix = `${year}-${String(month).padStart(2, "0")}`;
      return Object.values(entries)
        .filter((e) => e.date.startsWith(prefix))
        .sort((a, b) => b.date.localeCompare(a.date));
    },
    [entries]
  );

  const hasEntry = useCallback(
    (date: string): boolean => date in entries,
    [entries]
  );

  return {
    entries,
    isLoaded,
    getEntry,
    upsertEntry,
    removeEntry,
    getEntriesForMonth,
    hasEntry,
  };
}
