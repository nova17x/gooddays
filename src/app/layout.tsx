import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import Header from "@/components/Header";
import BackupBanner from "@/components/BackupBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenMaru.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24">
            <Header />
            <main>{children}</main>
          </div>
          <BackupBanner />
        </ErrorBoundary>
      </body>
    </html>
  );
}
