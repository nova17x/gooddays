import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Good Days - いいこと日記",
  description: "今日あった良いことを書き留める日記アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenMaru.variable} font-sans antialiased`}>
        <main className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
