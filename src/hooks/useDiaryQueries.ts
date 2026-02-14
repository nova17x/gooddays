"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { getCalendarDays } from "@/lib/date-utils";

export function useDateEntries(date: string) {
    return useLiveQuery(
        () => db.entries.where("date").equals(date).toArray(),
        [date]
    );
}

export function useMonthEntries(year: number, month: number) {
    return useLiveQuery(async () => {
        // We need to cover the full calendar range (including prev/next month days)
        // if we want dots for them.
        // Or just query the current month strictly for the timeline?
        // Let's query the specific month for the timeline.
        const prefix = `${year}-${String(month).padStart(2, "0")}`;
        return db.entries
            .filter((e) => e.date.startsWith(prefix))
            .reverse()
            .sortBy("date"); // Dexie collections are sortable
    }, [year, month]);
}

export function useCalendarEntryDates(year: number, month: number) {
    return useLiveQuery(async () => {
        // Get the range of dates displayed in the calendar
        const days = getCalendarDays(year, month);
        if (days.length === 0) return new Set<string>();

        const startDate = days[0].date;
        const endDate = days[days.length - 1].date;

        // Range query
        const entries = await db.entries
            .where("date")
            .between(startDate, endDate, true, true)
            .toArray();

        return new Set(entries.map((e) => e.date));
    }, [year, month]);
}

export function useDiagramStats() {
    return useLiveQuery(async () => {
        const count = await db.entries.count();
        // For day count, we need unique dates.
        // This might be expensive on huge datasets, but db.entries.orderBy('date').uniqueKeys()
        // is efficiently supported in Dexie.
        const uniqueDates = await db.entries.orderBy('date').uniqueKeys();
        return {
            entryCount: count,
            dayCount: uniqueDates.length
        };
    });
}

export function useAllEntries() {
    return useLiveQuery(() => db.entries.toArray());
}
