"use client";

import Link from "next/link";
import { useDiaryStore } from "@/hooks/useDiaryStore";
import BackupRestore from "@/components/BackupRestore";

const SETTING_LINKS = [
    { href: "/settings/qa", label: "Q&A", icon: "❓", description: "よくある質問と回答" },
    { href: "/settings/privacy", label: "プライバシーポリシー", icon: "🔒", description: "データの取り扱いについて" },
    { href: "/settings/about", label: "このアプリについて", icon: "💡", description: "Good Daysの紹介とリンク" },
];

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

            {/* Info Links */}
            <div className="mt-6 space-y-3">
                {SETTING_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-4 bg-bg-card border border-warm-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-warm-300 hover:shadow-md transition-all group"
                    >
                        <span className="text-2xl">{link.icon}</span>
                        <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium group-hover:text-warm-600 transition-colors">
                                {link.label}
                            </span>
                            <p className="text-xs text-text-muted mt-0.5">{link.description}</p>
                        </div>
                        <span className="text-text-light text-sm group-hover:text-warm-400 transition-colors">›</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
