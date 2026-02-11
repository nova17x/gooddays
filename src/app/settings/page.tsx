"use client";

import { useDiaryStore } from "@/hooks/useDiaryStore";
import BackupRestore from "@/components/BackupRestore";

export default function SettingsPage() {
    const { store, replaceStore, isLoaded } = useDiaryStore();

    if (!isLoaded) {
        return (
            <div className="text-center py-20 text-text-light">読み込み中...</div>
        );
    }

    return (
        <div>
            <h1 className="text-lg font-medium mb-6">設定</h1>
            <BackupRestore store={store} onImport={replaceStore} />
        </div>
    );
}
