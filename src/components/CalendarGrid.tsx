"use client";

import Link from "next/link";
import { getCalendarDays, getTodayString } from "@/lib/date-utils";
import type { DiaryEntry } from "@/lib/types";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const MOOD_COLORS: Record<string, string> = {
  "😊": "bg-orange-100 text-orange-600 hover:bg-orange-200",
  "😐": "bg-gray-100 text-gray-600 hover:bg-gray-200",
  "😢": "bg-blue-100 text-blue-600 hover:bg-blue-200",
  "😡": "bg-red-100 text-red-600 hover:bg-red-200",
  "😌": "bg-green-100 text-green-600 hover:bg-green-200",
  "🤔": "bg-purple-100 text-purple-600 hover:bg-purple-200",
  "😴": "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
  "🤩": "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
};

interface CalendarGridProps {
  year: number;
  month: number;
  entriesByDate: Map<string, DiaryEntry[]>;
}

export default function CalendarGrid({
  year,
  month,
  entriesByDate,
}: CalendarGridProps) {
  const days = getCalendarDays(year, month);
  const today = getTodayString();

  return (
    <div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`text-center text-xs py-1 ${i === 0
              ? "text-warm-400"
              : i === 6
                ? "text-warm-400"
                : "text-text-muted"
              }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((day) => {
          const entries = entriesByDate.get(day.date);
          const hasEntry = entries && entries.length > 0;
          const isToday = day.date === today;

          let colorClass = day.isCurrentMonth
            ? "hover:bg-warm-100/50 text-text"
            : "text-text-light/50 hover:bg-warm-50";

          if (hasEntry) {
            const latestEntry = entries[entries.length - 1]; // Use latest entry for mood
            if (latestEntry.mood && MOOD_COLORS[latestEntry.mood]) {
              colorClass = MOOD_COLORS[latestEntry.mood];
            } else {
              // Fallback for entry without mood or unknown mood
              colorClass = "bg-warm-100 text-warm-600 hover:bg-warm-200";
            }
          }

          return (
            <Link
              key={day.date}
              href={`/entry/${day.date}`}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm min-h-[44px] transition-colors relative ${colorClass} ${isToday ? "ring-2 ring-warm-300 font-bold z-10" : ""}`}
            >
              <span>{day.day}</span>
              {hasEntry && !days[0].isCurrentMonth && !day.isCurrentMonth && (
                // Visual indicator for entries in other months if we want, 
                // but currently we just rely on background color.
                // Maybe add a small dot if mood is not present?
                // For now, consistent background color is good.
                null
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
