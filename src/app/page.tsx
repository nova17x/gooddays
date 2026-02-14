"use client";

import { useState, useCallback } from "react";
import { useDiaryActions } from "@/hooks/useDiaryStore";
import { useDateEntries } from "@/hooks/useDiaryQueries";
import { getTodayString, formatDateJa, addDays } from "@/lib/date-utils";
import DiaryEditor from "@/components/DiaryEditor";
import EntryCard from "@/components/EntryCard";
import EmptyState from "@/components/EmptyState";
import PromptChips from "@/components/PromptChips";

export default function Home() {
  const today = getTodayString();
  const [dateStr, setDateStr] = useState(today);
  const { addEntry, updateEntry, removeEntry } = useDiaryActions();
  const entries = useDateEntries(dateStr);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingPrompt, setAddingPrompt] = useState<string | null>(null);

  const handleAdd = useCallback(
    (body: string) => {
      addEntry(dateStr, addingPrompt ?? "", body);
      setAddingPrompt(null);
    },
    [dateStr, addEntry, addingPrompt]
  );

  const handleUpdate = useCallback(
    (id: string, body: string) => {
      updateEntry(dateStr, id, body);
    },
    [dateStr, updateEntry]
  );

  const handlePrevDay = () => setDateStr((prev) => addDays(prev, -1));
  const handleNextDay = () => setDateStr((prev) => addDays(prev, 1));

  if (!entries) {
    return (
      <div className="text-center py-20 text-text-light">読み込み中...</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevDay}
          className="p-2 -ml-2 rounded-full text-warm-400 hover:bg-warm-100 hover:text-warm-600 transition-colors"
          aria-label="前日へ"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-lg font-medium text-text-muted flex flex-col items-center">
          {formatDateJa(dateStr)}
          {dateStr === today && <span className="text-[10px] sm:text-xs bg-warm-200 text-warm-600 px-2 py-0.5 rounded-full mt-1">今日</span>}
        </h2>

        <button
          onClick={handleNextDay}
          className={`p-2 -mr-2 rounded-full transition-colors ${dateStr === today
            ? "text-warm-200 cursor-not-allowed"
            : "text-warm-400 hover:bg-warm-100 hover:text-warm-600"
            }`}
          disabled={dateStr === today}
          aria-label="翌日へ"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {addingPrompt === null && editingId === null && (
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
        {editingId !== null ? (
          entries
            .filter((entry) => entry.id === editingId)
            .map((entry) => (
              <DiaryEditor
                key={entry.id}
                prompt={entry.prompt}
                initialBody={entry.body}
                autoSave
                onSave={(body) => handleUpdate(entry.id, body)}
                onCancel={() => setEditingId(null)}
                onDelete={() => {
                  removeEntry(dateStr, entry.id);
                  setEditingId(null);
                }}
              />
            ))
        ) : addingPrompt !== null ? (
          <DiaryEditor
            prompt={addingPrompt}
            onSave={handleAdd}
            onCancel={() => setAddingPrompt(null)}
          />
        ) : (
          entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={() => {
                setEditingId(entry.id);
                setAddingPrompt(null);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
