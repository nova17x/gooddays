"use client";

import type { DiaryEntry } from "@/lib/types";
import { formatDateJa } from "@/lib/date-utils";

interface EntryCardProps {
  entry: DiaryEntry;
  showDate?: boolean;
  onEdit?: () => void;
}

export default function EntryCard({
  entry,
  showDate = false,
  onEdit,
}: EntryCardProps) {
  return (
    <div className="bg-bg-card border border-warm-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        {showDate && (
          <p className="text-sm text-text-muted mb-3">
            {formatDateJa(entry.date)}
          </p>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-text-light hover:text-warm-500 transition-colors ml-auto cursor-pointer"
          >
            編集
          </button>
        )}
      </div>
      {entry.prompt && (
        <p className="text-sm text-warm-400 font-medium mb-1">
          {entry.prompt}
        </p>
      )}
      <p className="whitespace-pre-wrap leading-relaxed">{entry.body}</p>
    </div>
  );
}
