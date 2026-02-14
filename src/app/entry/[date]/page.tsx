"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDiaryActions } from "@/hooks/useDiaryStore";
import { useDateEntries } from "@/hooks/useDiaryQueries";
import { formatDateJa } from "@/lib/date-utils";
import DiaryEditor from "@/components/DiaryEditor";
import EntryCard from "@/components/EntryCard";
import PromptChips from "@/components/PromptChips";
import Link from "next/link";

function isValidDate(dateStr: string): boolean {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const d = new Date(dateStr + "T00:00:00");
  return !isNaN(d.getTime());
}

export default function EntryPage() {
  const params = useParams();
  const dateStr = params.date as string;
  const { addEntry, updateEntry, removeEntry } = useDiaryActions();
  const entries = useDateEntries(dateStr);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingPrompt, setAddingPrompt] = useState<string | null>(null);

  const handleAdd = useCallback(
    (body: string, mood?: string) => {
      addEntry(dateStr, addingPrompt ?? "", body, mood);
      setAddingPrompt(null);
    },
    [dateStr, addEntry, addingPrompt]
  );

  const handleUpdate = useCallback(
    (id: string, body: string, mood?: string) => {
      updateEntry(dateStr, id, body, mood);
    },
    [dateStr, updateEntry]
  );

  if (!entries) {
    return (
      <div className="text-center py-20 text-text-light">読み込み中...</div>
    );
  }

  if (!isValidDate(dateStr)) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted mb-4">無効な日付です</p>
        <Link href="/" className="text-warm-500 hover:text-warm-600 text-sm">
          ホームに戻る
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-text-muted mb-4">{formatDateJa(dateStr)}</p>

      {addingPrompt === null && (
        <div className="mb-6">
          <PromptChips
            onSelect={(promptText) => {
              setEditingId(null);
              setAddingPrompt(promptText);
            }}
            onFreeWrite={() => {
              setEditingId(null);
              setAddingPrompt("");
            }}
          />
        </div>
      )}

      {entries.length === 0 && addingPrompt === null && (
        <p className="text-center text-text-light text-sm py-8">
          この日の日記はまだありません
        </p>
      )}

      <div className="space-y-4">
        {entries.map((entry) =>
          editingId === entry.id ? (
            <DiaryEditor
              key={entry.id}
              prompt={entry.prompt}
              initialBody={entry.body}
              initialMood={entry.mood}
              autoSave
              onSave={(body, mood) => handleUpdate(entry.id, body, mood)}
              onCancel={() => setEditingId(null)}
              onDelete={() => {
                removeEntry(dateStr, entry.id);
                setEditingId(null);
              }}
            />
          ) : (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={() => {
                setEditingId(entry.id);
                setAddingPrompt(null);
              }}
            />
          )
        )}
      </div>

      {addingPrompt !== null && (
        <div className={entries.length > 0 ? "mt-4" : ""}>
          <DiaryEditor
            prompt={addingPrompt}
            onSave={handleAdd}
            onCancel={() => setAddingPrompt(null)}
          />
        </div>
      )}
    </div>
  );
}

