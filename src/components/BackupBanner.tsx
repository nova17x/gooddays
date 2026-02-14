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
        <div className="fixed bottom-24 sm:bottom-6 left-0 right-0 z-40 p-4 pointer-events-none transition-transform duration-500 ease-out animate-in slide-in-from-bottom-10 fade-in">
            <div className="max-w-xl mx-auto pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-sm border border-warm-200 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden">
                    {/* Decorative accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-warm-400 to-warm-500" />

                    {exported ? (
                        <div className="flex items-center gap-3 pl-2 w-full">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <span className="text-green-600 text-lg">✓</span>
                            </div>
                            <p className="text-sm text-text font-medium flex-1">
                                バックアップが完了しました
                            </p>
                            <button
                                onClick={handleDismiss}
                                className="text-text-muted hover:text-text p-1"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 pl-2">
                                <p className="text-sm font-bold text-text mb-1">
                                    データのバックアップ
                                </p>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    大切な思い出を守るために、定期的な保存をおすすめします。
                                </p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2 text-xs font-medium text-text-muted hover:bg-warm-50 rounded-lg transition-colors cursor-pointer"
                                >
                                    あとで
                                </button>
                                <button
                                    onClick={handleBackup}
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-warm-400 to-warm-500 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:from-warm-500 hover:to-warm-600 transition-all cursor-pointer whitespace-nowrap"
                                >
                                    保存する
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
