"use client";

import { Clock } from "lucide-react";
import { useLocalDateTime } from "@/hooks/use-local-date-time";
import { usePantry } from "@/lib/data/provider";

export function LiveClock() {
  const { profile } = usePantry();
  const { isMounted, timeFormatted, timeZoneAbbr, fullDateTimeTooltip } = useLocalDateTime(profile?.country);

  if (!isMounted) {
    return (
      <div
        className="live-clock-pill"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.35rem 0.65rem",
          borderRadius: "999px",
          background: "var(--surface-soft)",
          border: "1px solid var(--line)",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--muted)",
          opacity: 0.6,
        }}
      >
        <Clock size={14} />
        <span>--:--</span>
      </div>
    );
  }

  return (
    <div
      className="live-clock-pill"
      title={fullDateTimeTooltip}
      aria-label="Current local time"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.38rem 0.75rem",
        borderRadius: "999px",
        background: "var(--surface-soft)",
        border: "1px solid var(--line)",
        fontSize: "0.8rem",
        fontWeight: 650,
        color: "var(--text)",
        whiteSpace: "nowrap",
      }}
    >
      <Clock size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
      <span>{timeFormatted}</span>
      {timeZoneAbbr && (
        <small className="clock-abbr" style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 750 }}>
          {timeZoneAbbr}
        </small>
      )}
    </div>
  );
}
