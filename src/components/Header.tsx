"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="mb-2 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <Link href="/" className="group flex items-baseline gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-warm-500 group-hover:text-warm-600 transition-colors">
            {APP_NAME}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">{APP_TAGLINE}</p>
        </Link>
        <nav className="hidden sm:flex gap-2 sm:gap-4">
          <Link
            href="/"
            className={`text-sm whitespace-nowrap px-3 sm:px-4 py-2 rounded-full transition-colors ${pathname === "/"
              ? "bg-warm-200 text-warm-600 font-medium"
              : "text-text-muted hover:text-text hover:bg-warm-100"
              }`}
          >
            今日
          </Link>
          <Link
            href="/calendar"
            className={`text-sm whitespace-nowrap px-3 sm:px-4 py-2 rounded-full transition-colors ${pathname === "/calendar"
              ? "bg-warm-200 text-warm-600 font-medium"
              : "text-text-muted hover:text-text hover:bg-warm-100"
              }`}
          >
            カレンダー
          </Link>
          <Link
            href="/settings"
            className={`text-sm whitespace-nowrap px-3 sm:px-4 py-2 rounded-full transition-colors ${pathname === "/settings"
              ? "bg-warm-200 text-warm-600 font-medium"
              : "text-text-muted hover:text-text hover:bg-warm-100"
              }`}
          >
            設定
          </Link>
        </nav>
      </div>
    </header>
  );
}
