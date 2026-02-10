"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDiaryStore } from "@/hooks/useDiaryStore";
import { formatDateJa } from "@/lib/date-utils";
import DiaryEditor from "@/components/DiaryEditor";
import EntryCard from "@/components/EntryCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import Link from "next/link";

function isValidDate(dateStr: string): boolean {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const d = new Date(dateStr + "T00:00:00");
  return !isNaN(d.getTime());
}

export default function EntryPage() {
  const params = useParams();
  const router = useRouter();
  const dateStr = params.date as string;
  const { getEntry, upsertEntry, removeEntry, isLoaded } = useDiaryStore();
  const entry = getEntry(dateStr);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSave = useCallback(
    (body: string) => {
      if (body.trim() === "") {
        removeEntry(dateStr);
      } else {
        upsertEntry(dateStr, body);
      }
    },
    [dateStr, upsertEntry, removeEntry]
  );

  const handleDelete = () => {
    removeEntry(dateStr);
    setShowDeleteDialog(false);
    router.push("/calendar");
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

      {entry && !isEditing ? (
        <div>
          <EntryCard entry={entry} />
          <div className="mt-4 flex justify-center gap-6">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-text-muted hover:text-warm-500 transition-colors cursor-pointer"
            >
              編集する
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-sm text-text-light hover:text-warm-500 transition-colors cursor-pointer"
            >
              削除する
            </button>
          </div>
        </div>
      ) : (
        <div>
          <DiaryEditor
            date={dateStr}
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

      {showDeleteDialog && (
        <ConfirmDialog
          message="この日記を削除しますか？"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}
