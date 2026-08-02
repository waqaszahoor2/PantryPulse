"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CheckCheck, X } from "lucide-react";
import { usePantry } from "@/lib/data/provider";
import { formatRelativeTime } from "@/lib/date-time";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, markNotificationRead } = usePantry();

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const latestNotifications = notifications.slice(0, 5);

  function markAllRead() {
    notifications.forEach((item) => {
      if (!item.read) markNotificationRead(item.id);
    });
  }

  return (
    <div
      ref={dropdownRef}
      role="dialog"
      aria-label="Notification center dropdown"
      className="panel notification-dropdown shadow-lg"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: "min(380px, 92vw)",
        maxHeight: "480px",
        display: "flex",
        flexDirection: "column",
        zIndex: 1050,
        padding: "1rem",
        borderRadius: "16px",
        background: "var(--surface)",
        border: "1px solid var(--line)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: "1px solid var(--line)", paddingBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Bell size={18} style={{ color: "var(--primary)" }} />
          <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text)" }}>Notifications</h3>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <button
            type="button"
            onClick={markAllRead}
            className="button button-ghost button-small"
            style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
            title="Mark all as read"
          >
            <CheckCheck size={14} /> Mark read
          </button>
          <button
            type="button"
            onClick={onClose}
            className="icon-button subtle"
            aria-label="Close notification menu"
            style={{ width: "32px", height: "32px" }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {latestNotifications.length === 0 ? (
          <div style={{ padding: "1.5rem 0.5rem", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
            No unread notifications right now.
          </div>
        ) : (
          latestNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              style={{
                padding: "0.65rem 0.75rem",
                borderRadius: "10px",
                background: item.read ? "transparent" : "rgba(20,160,105,0.08)",
                border: "1px solid var(--line-soft)",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                <strong style={{ fontSize: "0.85rem", color: "var(--text)" }}>{item.title}</strong>
                <small className="muted" style={{ fontSize: "0.7rem" }}>{formatRelativeTime(item.createdAt)}</small>
              </div>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>{item.message}</p>
            </div>
          ))
        )}
      </div>

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: "0.75rem", marginTop: "0.5rem", textAlign: "center" }}>
        <Link
          href="/notifications"
          onClick={onClose}
          className="link-text"
          style={{ fontSize: "0.82rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
        >
          View all notifications <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
