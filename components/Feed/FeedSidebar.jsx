"use client";
import Link from "next/link";

const s = {
  sidebar: {
    width: "180px",
    backgroundColor: "#0d0d18",
    borderRight: "1px solid #1a1a2e",
    padding: "24px 16px",
    flexShrink: 0,
    minHeight: "calc(100vh - 90px)",
  },
  logo: {
    fontFamily: "var(--font-syne), sans-serif",
    fontWeight: 800,
    fontSize: "22px",
    color: "#fff",
    display: "flex",
    marginBottom: "20px",
    textDecoration: "none",
  },
  dot: { color: "#500fe9" },
  section: {
    fontSize: "11px",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
  },
  item: {
    backgroundColor: "#1e1a3a",
    color: "#a78bfa",
    fontSize: "13px",
    fontWeight: 500,
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    textDecoration: "none",
    display: "block",
  },
};

export default function FeedSidebar() {
  return (
    <aside style={s.sidebar}>
      <Link href="/" style={s.logo}>
        Nexora<span style={s.dot}>.</span>
      </Link>
      <p style={s.section}>Explorar</p>
      <Link href="/feed" style={s.item}>Feed de trabajos</Link>
    </aside>
  );
}