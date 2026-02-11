"use client";

import { useState, useRef } from "react";
import { exportDiary, importDiary, mergeDiaryStores, getLastBackupDate, getDiaryStats } from "@/lib/backup";
import type { DiaryStore } from "@/lib/types";
import ConfirmDialog from "@/components/ConfirmDialog";

interface BackupRestoreProps {
    store: DiaryStore;
    onImport: (newStore: DiaryStore) => void;
}

export default function BackupRestore({ store, onImport }: BackupRestoreProps) {
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingStore, setPendingStore] = useState<DiaryStore | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const lastBackup = getLastBackupDate();
    const stats = getDiaryStats(store);

    const handleExport = () => {
        exportDiary(store);
        setMessage({ text: "バックアップしました ✓", type: "success" });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const imported = await importDiary(file);
            const importedStats = getDiaryStats(imported);
            setPendingStore(imported);
            setShowConfirm(true);
            setMessage(null);
        } catch (err) {
            setMessage({
                text: err instanceof Error ? err.message : "ファイルの読み込みに失敗しました",
                type: "error",
            });
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleConfirmImport = () => {
        if (!pendingStore) return;

        const merged = mergeDiaryStores(store, pendingStore);
        onImport(merged);

        const mergedStats = getDiaryStats(merged);
        setMessage({
            text: `復元しました ✓（${mergedStats.dayCount}日分、${mergedStats.entryCount}件）`,
            type: "success",
        });
        setPendingStore(null);
        setShowConfirm(false);
        setTimeout(() => setMessage(null), 4000);
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="bg-bg-card border border-warm-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                <h2 className="text-base font-medium mb-3">日記データ</h2>
                <div className="flex gap-6 text-sm text-text-muted">
                    <div>
                        <span className="text-2xl font-bold text-warm-500">{stats.dayCount}</span>
                        <span className="ml-1">日分</span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold text-warm-500">{stats.entryCount}</span>
                        <span className="ml-1">件のエントリ</span>
                    </div>
                </div>
                {lastBackup && (
                    <p className="text-xs text-text-light mt-3">
                        最終バックアップ: {lastBackup.toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                )}
                {!lastBackup && stats.entryCount > 0 && (
                    <p className="text-xs text-warm-400 mt-3">
                        まだバックアップを取っていません
                    </p>
                )}
            </div>

            {/* Export */}
            <div className="bg-bg-card border border-warm-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                <h2 className="text-base font-medium mb-2">バックアップ</h2>
                <p className="text-sm text-text-muted mb-4">
                    日記データをJSONファイルとしてダウンロードします。
                    ファイル名は常に同じなので、上書き保存するだけでOKです。
                </p>
                <button
                    onClick={handleExport}
                    disabled={stats.entryCount === 0}
                    className="px-5 py-2 min-h-[44px] rounded-full bg-gradient-to-r from-warm-400 to-warm-500 text-white text-sm font-medium hover:from-warm-500 hover:to-warm-600 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    📥 バックアップをダウンロード
                </button>
            </div>

            {/* Import */}
            <div className="bg-bg-card border border-warm-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                <h2 className="text-base font-medium mb-2">復元</h2>
                <p className="text-sm text-text-muted mb-4">
                    バックアップファイルから日記を復元します。
                    既存のデータとマージされるので、データが消えることはありません。
                </p>
                <label className="inline-flex items-center px-5 py-2 min-h-[44px] rounded-full border-2 border-warm-300 text-warm-600 text-sm font-medium hover:bg-warm-100 transition-colors cursor-pointer">
                    📤 バックアップから復元
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`text-sm text-center py-3 px-4 rounded-xl ${message.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Import Confirm Dialog */}
            {showConfirm && pendingStore && (
                <ConfirmDialog
                    message={`バックアップから${getDiaryStats(pendingStore).entryCount}件のエントリを復元しますか？既存のデータは保持されます。`}
                    confirmLabel="復元する"
                    onConfirm={handleConfirmImport}
                    onCancel={() => {
                        setShowConfirm(false);
                        setPendingStore(null);
                    }}
                />
            )}
        </div>
    );
}
