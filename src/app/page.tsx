"use client";

import { useState, useCallback } from "react";
import { useDiaryStore } from "@/hooks/useDiaryStore";
import { getTodayString, formatDateJa } from "@/lib/date-utils";
import DiaryEditor from "@/components/DiaryEditor";
import EntryCard from "@/components/EntryCard";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const today = getTodayString();
  const { getEntry, upsertEntry, removeEntry, isLoaded } = useDiaryStore();
  const entry = getEntry(today);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = useCallback(
    (body: string) => {
      if (body.trim() === "") {
        removeEntry(today);
      } else {
        upsertEntry(today, body);
      }
    },
    [today, upsertEntry, removeEntry]
  );

  if (!isLoaded) {
    return (
      <div className="text-center py-20 text-text-light">読み込み中...</div>
    );
  }

  return (
    <div>
      <p className="text-sm text-text-muted mb-6">{formatDateJa(today)}</p>

      {entry && !isEditing ? (
        <div>
          <EntryCard entry={entry} />
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-text-muted hover:text-warm-500 transition-colors cursor-pointer"
            >
              編集する
            </button>
          </div>
        </div>
      ) : (
        <div>
          {!entry && <EmptyState />}
          <DiaryEditor
            date={today}
            initialBody={entry?.body ?? ""}
            onSave={handleSave}
          />
          {entry && (
            <div className="mt-2 text-center">
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm text-text-muted hover:text-warm-500 transition-colors cursor-pointer"
              >
                閉じる
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
