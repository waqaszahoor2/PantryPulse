"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, CheckCircle2, Send } from "lucide-react";

export function NotificationPermission({ compact = false }: { compact?: boolean }) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [busy, setBusy] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    navigator.serviceWorker.register("/sw.js").catch((error) => console.error("Service worker registration failed", error));
  }, []);

  async function requestPermission() {
    if (permission === "unsupported") return;
    setBusy(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification("PantryPulse alerts enabled", {
          body: "You can now receive expiry reminders while this browser supports them.",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "pantrypulse-permission",
          data: { url: "/notifications" },
        });
      }
    } finally {
      setBusy(false);
    }
  }

  async function sendTestNotification() {
    if (permission !== "granted") return;
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("PantryPulse Test Notification", {
        body: "Test notification working properly! PantryPulse will remind you of items expiring soon.",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: "pantrypulse-test",
        data: { url: "/dashboard" },
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } catch {
      alert("Unable to send test notification. Check browser settings.");
    }
  }

  if (compact) {
    return (
      <button
        className="icon-button"
        onClick={requestPermission}
        title="Notification permission"
        aria-label="Notification permission"
      >
        {permission === "granted" ? <CheckCircle2 size={18} /> : permission === "denied" ? <BellOff size={18} /> : <Bell size={18} />}
      </button>
    );
  }

  return (
    <div className="permission-card">
      <div className="permission-icon">
        {permission === "granted" ? <CheckCircle2 /> : permission === "denied" ? <BellOff /> : <Bell />}
      </div>

      <div className="permission-copy">
        <strong>
          {permission === "granted"
            ? "Browser alerts are enabled"
            : permission === "denied"
              ? "Browser alerts are blocked"
              : permission === "unsupported"
                ? "Notifications are not supported"
                : "Enable expiry alerts"}
        </strong>

        <p>
          {permission === "granted"
            ? "Browser reminders are generated while PantryPulse is open. Background delivery depends on browser support and notification configuration."
            : permission === "denied"
              ? "To disable or enable alerts, change site notification permissions in your browser settings (click lock icon next to URL)."
              : permission === "unsupported"
                ? "Use a modern browser over HTTPS for notifications."
                : "Permission is requested only after you click the button below."}
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        {permission === "default" && (
          <button className="button button-primary" disabled={busy} onClick={requestPermission}>
            {busy ? "Requesting…" : "Enable alerts"}
          </button>
        )}

        {permission === "granted" && (
          <button className="button button-soft button-small" onClick={sendTestNotification}>
            <Send size={14} /> {testSent ? "Test Sent!" : "Test Notification"}
          </button>
        )}
      </div>
    </div>
  );
}

export function useExpiryNotifications(items: { id: string; productName: string; expiryDate: string; status: string }[]) {
  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted" || !("serviceWorker" in navigator)) return;
    const todayKey = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem("pantrypulse.lastExpiryNotification") === todayKey) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const urgent = items.filter((item) => {
      if (item.status !== "available") return false;
      const expiry = new Date(`${item.expiryDate}T00:00:00`);
      const days = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
      return days >= 0 && days <= 2;
    });
    if (!urgent.length) return;
    navigator.serviceWorker.ready
      .then((registration) =>
        registration.showNotification(`${urgent.length} item${urgent.length > 1 ? "s" : ""} need attention`, {
          body: urgent
            .slice(0, 3)
            .map((item) => item.productName)
            .join(", "),
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: `pantrypulse-expiry-${todayKey}`,
          data: { url: "/dashboard" },
        })
      )
      .then(() => localStorage.setItem("pantrypulse.lastExpiryNotification", todayKey))
      .catch(console.error);
  }, [items]);
}
