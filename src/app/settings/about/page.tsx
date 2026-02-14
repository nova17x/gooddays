import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const TECH_STACK = ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"];

export default function AboutPage() {
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

            <h1 className="text-lg font-medium mb-6">このアプリについて</h1>

            {/* App Info */}
            <div className="bg-bg-card border border-warm-100 rounded-2xl p-5 sm:p-6 shadow-sm text-center mb-4">
                <h2 className="text-xl font-bold text-warm-500">{APP_NAME}</h2>
                <p className="text-sm text-text-muted mt-1">{APP_TAGLINE}</p>
                <p className="text-sm text-text-muted mt-4 leading-relaxed max-w-md mx-auto">
                    毎日の小さな良いことを書き留めて、
                    <br />
                    ポジティブな振り返りの習慣をつくるアプリです。
                </p>
            </div>

            {/* Features */}
            <div className="bg-bg-card border border-warm-100 rounded-2xl p-4 sm:p-5 shadow-sm mb-4">
                <h2 className="text-sm font-medium mb-3">特徴</h2>
                <ul className="space-y-2 text-sm text-text-muted">
                    <li className="flex gap-2">
                        <span>✏️</span>
                        <span>プロンプトで書き始めのきっかけを提供</span>
                    </li>
                    <li className="flex gap-2">
                        <span>💾</span>
                        <span>オートセーブで書き心地を大切に</span>
                    </li>
                    <li className="flex gap-2">
                        <span>📅</span>
                        <span>カレンダーで過去の日記を振り返り</span>
                    </li>
                    <li className="flex gap-2">
                        <span>🔒</span>
                        <span>データはブラウザ内のみ、外部送信なし</span>
                    </li>
                </ul>
            </div>

            {/* Tech Stack */}
            <div className="bg-bg-card border border-warm-100 rounded-2xl p-4 sm:p-5 shadow-sm mb-4">
                <h2 className="text-sm font-medium mb-3">技術スタック</h2>
                <div className="flex flex-wrap gap-2">
                    {TECH_STACK.map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 text-xs rounded-full bg-warm-100 text-warm-600"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Links */}
            <div className="bg-bg-card border border-warm-100 rounded-2xl p-4 sm:p-5 shadow-sm">
                <h2 className="text-sm font-medium mb-3">リンク</h2>
                <div className="space-y-2">
                    <a
                        href="https://github.com/nova17x/gooddays"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-warm-500 hover:text-warm-600 transition-colors"
                    >
                        <span>📦</span>
                        <span className="underline underline-offset-2">GitHub リポジトリ</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
