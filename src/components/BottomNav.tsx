"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "今日", icon: "✏️" },
        { href: "/calendar", label: "カレンダー", icon: "📅" },
        { href: "/settings", label: "設定", icon: "⚙️" },
    ];

    return (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-warm-200 px-6 pt-2 pb-6 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <nav className="flex justify-between items-center max-w-sm mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[64px] ${isActive
                                ? "text-warm-600 bg-warm-100/50"
                                : "text-text-muted hover:text-text hover:bg-warm-50"
                                }`}
                        >
                            <span className="text-xl mb-0.5">{item.icon}</span>
                            <span className={`text-[10px] font-medium ${isActive ? "text-warm-600" : "text-text-muted"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
            {/* Safe area spacer for iPhone home indicator */}
            <div className="h-6 w-full" />
        </div>
    );
}
