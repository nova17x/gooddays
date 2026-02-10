"use client";

import { useState } from "react";
import { useDiaryStore } from "@/hooks/useDiaryStore";
import { formatMonthJa, formatDateJa } from "@/lib/date-utils";
import CalendarGrid from "@/components/CalendarGrid";
import EntryCard from "@/components/EntryCard";
import Link from "next/link";

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { store, getEntriesForMonth, isLoaded } = useDiaryStore();
  const monthEntries = getEntriesForMonth(year, month);

  // Group entries by date
  const entriesByDate = new Map<string, typeof monthEntries>();
  for (const entry of monthEntries) {
    const existing = entriesByDate.get(entry.date) ?? [];
    existing.push(entry);
    entriesByDate.set(entry.date, existing);
  }
  const sortedDates = [...entriesByDate.keys()].sort((a, b) =>
    b.localeCompare(a)
  );

  const goToPrevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  if (!isLoaded) {
    return (
      <div className="text-center py-20 text-text-light">読み込み中...</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-full hover:bg-warm-100 text-text-muted transition-colors cursor-pointer"
        >
          &larr;
        </button>
        <h2 className="text-lg font-medium">{formatMonthJa(year, month)}</h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-warm-100 text-text-muted transition-colors cursor-pointer"
        >
          &rarr;
        </button>
      </div>

      <div className="bg-bg-card border border-warm-100 rounded-2xl p-4 shadow-sm mb-8">
        <CalendarGrid year={year} month={month} entries={store} />
      </div>

      {sortedDates.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-sm text-text-muted">
            {formatMonthJa(year, month)}の日記 ({monthEntries.length}件)
          </h3>
          {sortedDates.map((date) => (
            <div key={date}>
              <Link
                href={`/entry/${date}`}
                className="text-sm text-text-muted hover:text-warm-500 transition-colors mb-2 block"
              >
                {formatDateJa(date)}
              </Link>
              <div className="space-y-3">
                {entriesByDate.get(date)!.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-text-light text-sm py-8">
          この月の日記はまだありません
        </p>
      )}
    </div>
  );
}
