"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, CheckCircle2 } from "lucide-react";

export function NotificationPermission({ compact = false }: { compact?: boolean }) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [busy, setBusy] = useState(false);

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

  if (compact) {
    return <button className="icon-button" onClick={requestPermission} title="Notification permission" aria-label="Notification permission">{permission === "granted" ? <CheckCircle2 size={18} /> : permission === "denied" ? <BellOff size={18} /> : <Bell size={18} />}</button>;
  }

  return (
    <div className="permission-card">
      <div className="permission-icon">{permission === "granted" ? <CheckCircle2 /> : permission === "denied" ? <BellOff /> : <Bell />}</div>
      <div className="permission-copy">
        <strong>{permission === "granted" ? "Browser alerts are enabled" : permission === "denied" ? "Browser alerts are blocked" : permission === "unsupported" ? "Notifications are not supported" : "Enable expiry alerts"}</strong>
        <p>{permission === "granted" ? "PantryPulse can display reminders from this device." : permission === "denied" ? "Change the site permission in your browser settings to enable alerts." : permission === "unsupported" ? "Use a modern browser over HTTPS for notifications." : "Permission is requested only after you press the button."}</p>
      </div>
      {permission === "default" && <button className="button button-primary" disabled={busy} onClick={requestPermission}>{busy ? "Requesting…" : "Enable alerts"}</button>}
    </div>
  );
}

export function useExpiryNotifications(items: { id: string; productName: string; expiryDate: string; status: string }[]) {
  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted" || !("serviceWorker" in navigator)) return;
    const todayKey = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem("pantrypulse.lastExpiryNotification") === todayKey) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const urgent = items.filter((item) => {
      if (item.status !== "available") return false;
      const expiry = new Date(`${item.expiryDate}T00:00:00`);
      const days = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
      return days >= 0 && days <= 2;
    });
    if (!urgent.length) return;
    navigator.serviceWorker.ready.then((registration) => registration.showNotification(`${urgent.length} item${urgent.length > 1 ? "s" : ""} need attention`, {
      body: urgent.slice(0, 3).map((item) => item.productName).join(", "),
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: `pantrypulse-expiry-${todayKey}`,
      data: { url: "/dashboard" },
    })).then(() => localStorage.setItem("pantrypulse.lastExpiryNotification", todayKey)).catch(console.error);
  }, [items]);
}
