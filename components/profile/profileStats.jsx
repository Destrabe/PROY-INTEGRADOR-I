"use client";

export function Stars({ value }) {
  const r = Math.round(value);
  const valid = isNaN(value) ? 0 : value;
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-500 text-base">
        {"★".repeat(r)}{"☆".repeat(5 - r)}
      </span>
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        {valid.toFixed(1)}
      </span>
    </div>
  );
}

export function RepBar({ label, score }) {
  if (score === undefined) return null;
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="font-medium" style={{ color: "var(--text-main)" }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
        <div className="h-full rounded-full" style={{ width: `${(score / 5) * 100}%`, background: "var(--accent)" }} />
      </div>
    </div>
  );
}