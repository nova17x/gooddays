import Link from "next/link";
import { formatDateJa } from "@/lib/date-utils";
import type { DiaryEntry } from "@/lib/types";

interface DiaryTimelineProps {
    entriesByDate: Map<string, DiaryEntry[]>;
    sortedDates: string[];
}

export default function DiaryTimeline({
    entriesByDate,
    sortedDates,
}: DiaryTimelineProps) {
    if (sortedDates.length === 0) {
        return (
            <p className="text-center text-text-light text-sm py-8">
                この月の日記はまだありません
            </p>
        );
    }

    return (
        <div className="relative">
            {sortedDates.map((date, dateIndex) => {
                const entries = entriesByDate.get(date)!;
                const isLast = dateIndex === sortedDates.length - 1;

                return (
                    <div key={date} className="relative flex gap-4 pb-6">
                        {/* Timeline line + dot */}
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-warm-400 border-2 border-warm-200 mt-1 shrink-0 z-10" />
                            {!isLast && (
                                <div className="w-0.5 bg-warm-200 flex-1 min-h-4 absolute top-4 bottom-0 left-[5px]" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <Link
                                href={`/entry/${date}`}
                                className="text-sm font-medium text-text-muted hover:text-warm-500 transition-colors"
                            >
                                {formatDateJa(date)}
                            </Link>
                            <div className="mt-2 space-y-2">
                                {entries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="bg-bg-card border border-warm-100 rounded-xl p-3 sm:p-4 shadow-sm"
                                    >
                                        {entry.prompt && (
                                            <p className="text-xs text-warm-400 font-medium mb-1">
                                                {entry.prompt}
                                            </p>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed line-clamp-3">
                                            {entry.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
