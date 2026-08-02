"use client";

import { usePantry } from "@/lib/data/provider";
import { useLocalDateTime } from "@/hooks/use-local-date-time";

export function DynamicGreeting() {
  const { profile } = usePantry();
  const { isMounted, dateFormatted, greetingPrefix, fullDateTimeTooltip } = useLocalDateTime(profile?.country);

  const rawName = profile?.fullName?.trim() || profile?.email?.split("@")[0] || "";
  const displayName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "there";

  return (
    <div className="dynamic-greeting-header" style={{ marginBottom: "1.75rem" }}>
      <p
        className="eyebrow"
        title={fullDateTimeTooltip}
        style={{ fontSize: "0.78rem", fontWeight: 750, color: "var(--primary)", letterSpacing: "0.08em", marginBottom: "0.65rem" }}
      >
        {isMounted ? dateFormatted : "TODAY'S OVERVIEW"}
      </p>
      <h1 style={{ margin: "0 0 0.5rem", fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 850, lineHeight: 1.15, color: "var(--text)" }}>
        {greetingPrefix}, {displayName} <span aria-hidden="true">👋</span>
      </h1>
      <p className="muted" style={{ margin: 0, fontSize: "0.95rem", color: "var(--muted)" }}>
        Here is what needs attention in your pantry today.
      </p>
    </div>
  );
}
