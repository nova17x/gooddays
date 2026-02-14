import Link from "next/link";

const SECTIONS = [
    {
        title: "データの保存先について",
        content:
            "Good Daysに入力された日記の内容は、すべてお使いのブラウザのlocalStorage（ローカルストレージ）にのみ保存されます。外部のサーバーやクラウドにデータが送信・保存されることは一切ありません。",
    },
    {
        title: "外部送信の有無",
        content:
            "本アプリは、日記の内容やユーザーの個人情報を外部サーバーへ送信する機能を持っていません。すべてのデータ処理はお使いのブラウザ内で完結します。",
    },
    {
        title: "トラッキングについて",
        content:
            "本アプリでは、Google Analyticsなどのアクセス解析ツールや広告トラッキングは一切使用していません。ユーザーの行動が追跡・記録されることはありません。",
    },
    {
        title: "透明性について",
        content:
            "本アプリのソースコードはGitHub上に公開されています。どなたでもコードの内容を確認し、データがどのように処理されているかを検証することができます。",
        link: {
            label: "GitHubでソースコードを見る →",
            href: "https://github.com/nova17x/gooddays",
        },
    },
    {
        title: "免責事項",
        items: [
            "ブラウザのキャッシュ・データの消去、デバイスの故障・紛失等によりデータが消失した場合、開発者は責任を負いかねます。大切なデータは定期的にバックアップ機能をご利用ください。",
            "本アプリの利用によって生じたいかなる損害についても、開発者は責任を負いかねます。自己責任のもとでご利用ください。",
        ],
    },
    {
        title: "管理者情報",
        content: "開発・運営: nova17x",
    },
    {
        title: "お問い合わせ先",
        content:
            "不具合の報告やご質問は、以下の方法でお気軽にお寄せください。",
        links: [
            {
                label: "GitHub Issues で報告する",
                href: "https://github.com/nova17x/gooddays/issues",
            },
        ],
    },
    {
        title: "プライバシーポリシーの改定について",
        content:
            "本ポリシーは、必要に応じて内容を改定する場合があります。改定した場合は本ページにて告知します。",
    },
];

export default function PrivacyPolicyPage() {
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

            <h1 className="text-lg font-medium mb-2">プライバシーポリシー</h1>
            <p className="text-xs text-text-light mb-6">
                制定日: 2026年2月12日 ｜ 最終更新日: 2026年2月12日
            </p>

            <div className="space-y-4">
                {SECTIONS.map((section, i) => (
                    <div
                        key={i}
                        className="bg-bg-card border border-warm-100 rounded-2xl p-4 sm:p-5 shadow-sm"
                    >
                        <h2 className="text-sm font-medium mb-2">{section.title}</h2>

                        {section.content && (
                            <p className="text-sm text-text-muted leading-relaxed">
                                {section.content}
                            </p>
                        )}

                        {section.items && (
                            <ul className="space-y-2 text-sm text-text-muted leading-relaxed">
                                {section.items.map((item, j) => (
                                    <li key={j} className="flex gap-2">
                                        <span className="text-warm-400 mt-0.5 shrink-0">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {section.link && (
                            <a
                                href={section.link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 text-sm text-warm-500 hover:text-warm-600 underline underline-offset-2 transition-colors"
                            >
                                {section.link.label}
                            </a>
                        )}

                        {section.links && (
                            <div className="mt-3 space-y-2">
                                {section.links.map((link, j) => (
                                    <a
                                        key={j}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm text-warm-500 hover:text-warm-600 underline underline-offset-2 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
