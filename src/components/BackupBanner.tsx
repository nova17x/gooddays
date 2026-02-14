"use client";

import { useState } from "react";
import { shouldShowBackupReminder, exportDiary } from "@/lib/backup";
import { useDiagramStats } from "@/hooks/useDiaryQueries";
import { db } from "@/lib/db";

export default function BackupBanner() {
    const stats = useDiagramStats();
    const [dismissed, setDismissed] = useState(false);
    const [exported, setExported] = useState(false);

    const show = !dismissed && !exported && stats && shouldShowBackupReminder(stats.entryCount);

    if (!show) return null;

    const handleBackup = async () => {
        const entries = await db.entries.toArray();
        exportDiary(entries);
        setExported(true);
    };

    const handleDismiss = () => {
        setDismissed(true);
    };

    return (
        <div className="fixed bottom-20 sm:bottom-0 left-0 right-0 z-40 p-4 pointer-events-none">
            <div className="max-w-2xl mx-auto pointer-events-auto">
                <div className="bg-bg-card border border-warm-200 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {exported ? (
                        <p className="text-sm text-warm-500 font-medium flex-1">
                            バックアップしました ✓
                        </p>
                    ) : (
                        <>
                            <p className="text-sm text-text flex-1">
                                📋 バックアップはお済みですか？
                            </p>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2 min-h-[44px] rounded-full text-sm text-text-muted hover:bg-warm-100 transition-colors cursor-pointer flex-1 sm:flex-none"
                                >
                                    あとで
                                </button>
                                <button
                                    onClick={handleBackup}
                                    className="px-4 py-2 min-h-[44px] rounded-full bg-gradient-to-r from-warm-400 to-warm-500 text-white text-sm font-medium hover:from-warm-500 hover:to-warm-600 transition-all cursor-pointer flex-1 sm:flex-none"
                                >
                                    バックアップする
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
