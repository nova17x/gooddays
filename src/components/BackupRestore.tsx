"use client";

import { useState } from "react";
import { db } from "@/lib/db";
import { exportDiary, importDiary, mergeDiaryStores, entriesToStore } from "@/lib/backup";
import { useDiagramStats } from "@/hooks/useDiaryQueries";
import { useDiaryActions } from "@/hooks/useDiaryStore";

export default function BackupRestore() {
    const stats = useDiagramStats();
    const { replaceStore } = useDiaryActions();
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const handleExport = async () => {
        try {
            setIsExporting(true);
            setMessage(null);
            // Fetch all entries on demand
            const entries = await db.entries.toArray();
            exportDiary(entries);
            setMessage({ type: "success", text: "エクスポートが完了しました" });
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "エクスポートに失敗しました" });
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("現在のデータに上書き、またはマージしますか？\n（念のため、事前にエクスポートすることをお勧めします）")) {
            e.target.value = "";
            return;
        }

        try {
            setIsImporting(true);
            setMessage(null);

            const importedStore = await importDiary(file);

            // We need to merge with existing data
            const existingEntries = await db.entries.toArray();
            const existingStore = entriesToStore(existingEntries);

            const mergedStore = mergeDiaryStores(existingStore, importedStore);

            await replaceStore(mergedStore);

            setMessage({ type: "success", text: "インポートが完了しました" });
        } catch (error) {
            console.error(error);
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "インポートに失敗しました",
            });
        } finally {
            setIsImporting(false);
            e.target.value = "";
        }
    };

    if (!stats) {
        return <div className="p-4 text-center text-text-muted">読み込み中...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Stats Card */}
            <section className="bg-bg-card border border-warm-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
                    データ統計
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-warm-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-text-muted mb-1">日記を書いた日数</p>
                        <p className="text-2xl font-bold text-warm-600">
                            {stats.dayCount}
                            <span className="text-sm font-normal text-text-muted ml-1">日</span>
                        </p>
                    </div>
                    <div className="bg-warm-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-text-muted mb-1">総エントリー数</p>
                        <p className="text-2xl font-bold text-warm-600">
                            {stats.entryCount}
                            <span className="text-sm font-normal text-text-muted ml-1">件</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Backup Actions */}
            <section className="bg-bg-card border border-warm-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
                    バックアップと復元
                </h3>

                <div className="space-y-6">
                    {/* Export */}
                    <div>
                        <p className="text-sm text-text mb-3">
                            日記データをJSONファイルとしてダウンロードします。定期的なバックアップをお勧めします。
                        </p>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="w-full sm:w-auto px-6 py-2.5 bg-warm-500 text-white font-medium rounded-full hover:bg-warm-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            {isExporting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    エクスポート中...
                                </>
                            ) : (
                                <>
                                    <span>⬇️</span> バックアップをダウンロード
                                </>
                            )}
                        </button>
                    </div>

                    <div className="border-t border-warm-100" />

                    {/* Import */}
                    <div>
                        <p className="text-sm text-text mb-3">
                            バックアップファイル（.json）を読み込んで復元します。
                        </p>
                        <label className="inline-block w-full sm:w-auto">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                disabled={isImporting}
                                className="hidden"
                            />
                            <span className="w-full sm:w-auto px-6 py-2.5 bg-white border border-warm-200 text-text font-medium rounded-full hover:bg-warm-50 hover:border-warm-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2">
                                {isImporting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-warm-400 border-t-transparent rounded-full animate-spin" />
                                        インポート中...
                                    </>
                                ) : (
                                    <>
                                        <span>⬆️</span> バックアップから復元
                                    </>
                                )}
                            </span>
                        </label>
                    </div>

                    {message && (
                        <div
                            className={`p-4 rounded-xl text-sm ${message.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : "bg-red-50 text-red-700 border border-red-100"
                                } animate-in fade-in slide-in-from-top-2`}
                        >
                            {message.text}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
