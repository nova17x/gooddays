"use client";

import { useState, useCallback } from "react";
import { useDiaryStore } from "@/hooks/useDiaryStore";
import { getTodayString, formatDateJa } from "@/lib/date-utils";
import DiaryEditor from "@/components/DiaryEditor";
import EntryCard from "@/components/EntryCard";
import EmptyState from "@/components/EmptyState";
import PromptChips from "@/components/PromptChips";

export default function Home() {
  const today = getTodayString();
  const { getEntries, addEntry, updateEntry, removeEntry, isLoaded } =
    useDiaryStore();
  const entries = getEntries(today);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingPrompt, setAddingPrompt] = useState<string | null>(null);

  const handleAdd = useCallback(
    (body: string) => {
      addEntry(today, addingPrompt ?? "", body);
      setAddingPrompt(null);
    },
    [today, addEntry, addingPrompt]
  );

  const handleUpdate = useCallback(
    (id: string, body: string) => {
      if (body.trim() === "") {
        removeEntry(today, id);
      } else {
        updateEntry(today, id, body);
      }
    },
    [today, updateEntry, removeEntry]
  );

  if (!isLoaded) {
    return (
      <div className="text-center py-20 text-text-light">読み込み中...</div>
    );
  }

  return (
    <div>
      <p className="text-sm text-text-muted mb-4">{formatDateJa(today)}</p>

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

      {entries.length === 0 && addingPrompt === null && <EmptyState />}

      <div className="space-y-4">
        {entries.map((entry) =>
          editingId === entry.id ? (
            <DiaryEditor
              key={entry.id}
              prompt={entry.prompt}
              initialBody={entry.body}
              autoSave
              onSave={(body) => handleUpdate(entry.id, body)}
              onCancel={() => setEditingId(null)}
              onDelete={() => {
                removeEntry(today, entry.id);
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
