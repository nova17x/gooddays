"use client";

import Link from "next/link";

const QA_ITEMS = [
    {
        q: "日記データはどこに保存されますか？",
        a: "お使いのブラウザのlocalStorageに保存されます。サーバーには一切送信されません。",
    },
    {
        q: "別のデバイスでも使えますか？",
        a: "はい。設定画面のバックアップ機能でデータをJSONファイルに書き出し、別のデバイスで復元できます。",
    },
    {
        q: "ブラウザのデータを消したらどうなりますか？",
        a: "日記データも消えてしまいます。定期的にバックアップをお取りください。",
    },
    {
        q: "アカウント登録は必要ですか？",
        a: "いいえ。アカウント登録やログインは一切不要です。ブラウザを開くだけですぐに使えます。",
    },
    {
        q: "スマートフォンでも使えますか？",
        a: "はい。スマートフォンのブラウザからアクセスすればそのまま使えます。レスポンシブ対応しています。",
    },
    {
        q: "日記を書いたら自動的に保存されますか？",
        a: "はい。入力内容はリアルタイムでオートセーブされます。保存ボタンを押す必要はありません。",
    },
];

export default function QAPage() {
    return (
        <div>
            <div className="mb-6">
                <Link
                    href="/settings"
                    className="text-sm text-text-muted hover:text-warm-500 transition-colors"
                >
                    ← 設定に戻る
                </Link>
            </div>

            <h1 className="text-lg font-medium mb-6">❓ Q&A</h1>

            <div className="space-y-3">
                {QA_ITEMS.map((item, i) => (
                    <details
                        key={i}
                        className="bg-bg-card border border-warm-100 rounded-2xl shadow-sm group"
                    >
                        <summary className="cursor-pointer p-4 sm:p-5 text-sm font-medium list-none flex items-center gap-3 hover:text-warm-600 transition-colors">
                            <span className="text-warm-400 text-xs transition-transform group-open:rotate-90">▶</span>
                            {item.q}
                        </summary>
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
                            <p className="text-sm text-text-muted leading-relaxed pl-6">
                                {item.a}
                            </p>
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
}
