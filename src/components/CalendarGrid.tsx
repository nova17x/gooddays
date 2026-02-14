"use client";

import Link from "next/link";
import { getCalendarDays, getTodayString } from "@/lib/date-utils";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

interface CalendarGridProps {
  year: number;
  month: number;
  entryDates: Set<string>;
}

export default function CalendarGrid({
  year,
  month,
  entryDates,
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
          const hasEntry = entryDates.has(day.date);
          const isToday = day.date === today;

          return (
            <Link
              key={day.date}
              href={`/entry/${day.date}`}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm min-h-[44px] transition-colors ${day.isCurrentMonth
                ? "hover:bg-warm-100"
                : "text-text-light/50 hover:bg-warm-50"
                } ${isToday ? "ring-2 ring-warm-300 font-bold" : ""}`}
            >
              <span>{day.day}</span>
              {hasEntry && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-warm-400" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
