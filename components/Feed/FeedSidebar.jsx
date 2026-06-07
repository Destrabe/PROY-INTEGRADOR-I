"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/feedJobs", label: "Feed de trabajos" },
];

export default function FeedSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-44 p-6 shrink-0 min-h-[calc(100vh-90px)] hidden md:block border-r border-[var(--border-color)] bg-[var(--accent-bg)]">
      <Link href="/" className="font-syne font-extrabold text-2xl flex mb-5 no-underline text-[var(--text-main)]">
        Nexora<span className="text-[var(--accent)]">.</span>
      </Link>
      <p className="text-[11px] uppercase tracking-wider mb-2 text-[var(--text-muted)]">Explorar</p>
      {NAV_ITEMS.map((item) => {
        const activo = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block text-sm font-medium rounded-lg px-3 py-2 transition-all mb-1 no-underline ${
              activo
                ? "bg-[var(--accent-bg)] text-[var(--accent-text)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}