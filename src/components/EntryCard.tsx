import Link from "next/link";
import type { DiaryEntry } from "@/lib/types";
import { formatDateJa } from "@/lib/date-utils";

interface EntryCardProps {
  entry: DiaryEntry;
  showDate?: boolean;
}

export default function EntryCard({ entry, showDate = false }: EntryCardProps) {
  return (
    <div className="bg-bg-card border border-warm-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        {showDate && (
          <p className="text-sm text-text-muted mb-3">
            {formatDateJa(entry.date)}
          </p>
        )}
        <Link
          href={`/entry/${entry.date}`}
          className="text-xs text-text-light hover:text-warm-500 transition-colors ml-auto"
        >
          編集
        </Link>
      </div>
      <p className="whitespace-pre-wrap leading-relaxed">{entry.body}</p>
    </div>
  );
}
