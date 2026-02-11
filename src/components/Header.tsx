"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="group">
          <h1 className="text-xl sm:text-2xl font-bold text-warm-500 group-hover:text-warm-600 transition-colors">
            {APP_NAME}
          </h1>
          <p className="text-sm text-text-muted">{APP_TAGLINE}</p>
        </Link>
        <nav className="flex gap-2 sm:gap-4">
          <Link
            href="/"
            className={`text-sm px-3 sm:px-4 py-2 rounded-full transition-colors ${pathname === "/"
              ? "bg-warm-200 text-warm-600 font-medium"
              : "text-text-muted hover:text-text hover:bg-warm-100"
              }`}
          >
            今日の日記
          </Link>
          <Link
            href="/calendar"
            className={`text-sm px-3 sm:px-4 py-2 rounded-full transition-colors ${pathname === "/calendar"
              ? "bg-warm-200 text-warm-600 font-medium"
              : "text-text-muted hover:text-text hover:bg-warm-100"
              }`}
          >
            カレンダー
          </Link>
          <Link
            href="/settings"
            className={`text-sm px-3 sm:px-4 py-2 rounded-full transition-colors ${pathname === "/settings"
              ? "bg-warm-200 text-warm-600 font-medium"
              : "text-text-muted hover:text-text hover:bg-warm-100"
              }`}
          >
            ⚙ 設定
          </Link>
        </nav>
      </div>
    </header>
  );
}
