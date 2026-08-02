"use client";

import Link from "next/link";
import { Bell, CheckCheck, CircleAlert, Info, Trash2, TriangleAlert } from "lucide-react";
import { NotificationPermission } from "@/components/notifications/notification-permission";
import { usePantry } from "@/lib/data/provider";

const icons = {
  urgent: CircleAlert,
  warning: TriangleAlert,
  info: Info,
  success: CheckCheck,
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = usePantry();
  const unread = notifications.filter((note) => !note.read).length;

  return (
    <div className="page-stack">
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Expiry reminders</p>
          <h1>Notifications</h1>
          <p>{unread} unread update{unread === 1 ? "" : "s"}.</p>
        </div>
        {unread > 0 && (
          <button className="button button-soft" onClick={markAllNotificationsRead}>
            <CheckCheck size={17} /> Mark all read
          </button>
        )}
      </section>

      <NotificationPermission />

      <section className="notification-list">
        {notifications.length ? (
          notifications.map((note) => {
            const Icon = icons[note.type] || Info;
            return (
              <article key={note.id} className={`notification-row ${note.read ? "read" : ""}`}>
                <span className={`notification-type ${note.type}`}>
                  <Icon />
                </span>
                <div>
                  <div className="notification-heading">
                    <h2>{note.title}</h2>
                    {!note.read && <span>New</span>}
                  </div>
                  <p>{note.message}</p>
                  <small>{new Date(note.createdAt).toLocaleString()}</small>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {note.itemId && (
                    <Link href="/pantry" className="button button-ghost button-small">
                      View Item
                    </Link>
                  )}
                  {!note.read && (
                    <button className="button button-ghost button-small" onClick={() => markNotificationRead(note.id)}>
                      Mark read
                    </button>
                  )}
                  <button className="icon-button danger" onClick={() => deleteNotification(note.id)} aria-label="Delete notification">
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Bell /></span>
            <h3>No notifications yet</h3>
            <p>Expiry reminders and household warnings will appear here.</p>
          </div>
        )}
      </section>

      <div className="form-message info" style={{ marginTop: "2rem" }}>
        <Info size={16} />
        <span>
          <strong>Notification limits:</strong> Browser reminders are generated when PantryPulse is open. Background reminders may require additional browser permission and notification services.
        </span>
      </div>
    </div>
  );
}
