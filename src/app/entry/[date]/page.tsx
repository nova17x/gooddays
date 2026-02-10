"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDiaryStore } from "@/hooks/useDiaryStore";
import { formatDateJa } from "@/lib/date-utils";
import DiaryEditor from "@/components/DiaryEditor";
import EntryCard from "@/components/EntryCard";
import ConfirmDialog from "@/components/ConfirmDialog";
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
  const { getEntries, addEntry, updateEntry, removeEntry, isLoaded } =
    useDiaryStore();
  const entries = getEntries(dateStr);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      if (body.trim() === "") {
        removeEntry(dateStr, id);
      } else {
        updateEntry(dateStr, id, body);
      }
    },
    [dateStr, updateEntry, removeEntry]
  );

  const handleDelete = () => {
    if (deletingId) {
      removeEntry(dateStr, deletingId);
      setDeletingId(null);
    }
  };

  if (!isLoaded) {
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
      <p className="text-sm text-text-muted mb-6">{formatDateJa(dateStr)}</p>

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
              autoSave
              onSave={(body) => handleUpdate(entry.id, body)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={entry.id}>
              <EntryCard
                entry={entry}
                onEdit={() => {
                  setEditingId(entry.id);
                  setAddingPrompt(null);
                }}
              />
              <div className="mt-1 text-right">
                <button
                  onClick={() => setDeletingId(entry.id)}
                  className="text-xs text-text-light hover:text-warm-500 transition-colors cursor-pointer"
                >
                  削除
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {addingPrompt !== null ? (
        <div className={entries.length > 0 ? "mt-4" : ""}>
          <DiaryEditor
            prompt={addingPrompt}
            onSave={handleAdd}
            onCancel={() => setAddingPrompt(null)}
          />
        </div>
      ) : (
        <div className={entries.length > 0 ? "mt-6" : "mt-4"}>
          <PromptChips
            onSelect={(promptText) => {
              setEditingId(null);
              setAddingPrompt(promptText);
            }}
          />
          <button
            onClick={() => {
              setEditingId(null);
              setAddingPrompt("");
            }}
            className="mt-2 text-xs text-text-light hover:text-warm-500 transition-colors cursor-pointer"
          >
            自由に書く
          </button>
        </div>
      )}

      {deletingId && (
        <ConfirmDialog
          message="この日記を削除しますか？"
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
