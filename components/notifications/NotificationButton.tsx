"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { usePantry } from "@/lib/data/provider";
import { formatUnreadBadge } from "@/lib/date-time";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export function NotificationButton() {
  const { notifications } = usePantry();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((i) => !i.read).length, [notifications]);
  const badgeLabel = formatUnreadBadge(unreadCount);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        className="icon-button notification-button"
        onClick={() => setDropdownOpen((cur) => !cur)}
        aria-expanded={dropdownOpen}
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications. Open notification menu` : "Open notification menu"}
        style={{
          minWidth: "44px",
          minHeight: "44px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            className="notification-dot"
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              background: "var(--red, #e04545)",
              color: "#ffffff",
              borderRadius: "999px",
              padding: "0.1rem 0.4rem",
              fontSize: "0.68rem",
              fontWeight: 800,
              lineHeight: 1,
              border: "2px solid var(--topbar-bg)",
              minWidth: "18px",
              textAlign: "center",
            }}
          >
            {badgeLabel}
          </span>
        )}
      </button>

      <NotificationDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
    </div>
  );
}
