import type { RiskLevel } from "@/lib/types";

export function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  const label = level === "expired" ? "Expired" : `${level[0].toUpperCase()}${level.slice(1)} risk`;
  return <span className={`risk-badge risk-${level}`}>{label}{typeof score === "number" ? ` · ${score}%` : ""}</span>;
}
