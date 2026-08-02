"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, FileSpreadsheet, Mail, RotateCcw, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { NotificationPermission } from "@/components/notifications/notification-permission";
import { usePantry } from "@/lib/data/provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function SettingsPage() {
  const {
    profile,
    updateUserProfile,
    exportDataAsJSON,
    exportDataAsCSV,
    clearPantryData,
    clearEventHistory,
    clearShoppingData,
    clearLocalData,
    resetDemoData,
    mode,
  } = usePantry();

  const [name, setName] = useState("");
  const [household, setHousehold] = useState(1);
  const [currency, setCurrency] = useState("PKR");
  const [country, setCountry] = useState("PK");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@pantrypulse.app";

  useEffect(() => {
    if (profile) {
      setName(profile.fullName || "");
      setHousehold(profile.householdSize || 1);
      setCurrency(profile.currency || "PKR");
      setCountry(profile.country || "PK");
    }
  }, [profile]);

  async function saveProfile() {
    setMessage("");
    setSaving(true);
    try {
      await updateUserProfile({
        fullName: name.trim(),
        householdSize: household,
        currency,
        country,
      });
      setMessage("Profile preferences saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  function handleDownloadJSON() {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pantrypulse-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDownloadCSV() {
    const csvStr = exportDataAsCSV();
    const blob = new Blob([csvStr], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pantrypulse-pantry-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleClearPantry() {
    if (window.confirm("Are you sure you want to clear all pantry items? This action cannot be undone.")) {
      await clearPantryData();
      setMessage("All pantry items have been cleared.");
    }
  }

  async function handleClearHistory() {
    if (window.confirm("Are you sure you want to clear your activity history?")) {
      await clearEventHistory();
      setMessage("Activity history cleared.");
    }
  }

  async function handleClearShopping() {
    if (window.confirm("Are you sure you want to clear your shopping list?")) {
      await clearShoppingData();
      setMessage("Shopping list cleared.");
    }
  }

  async function deleteAccount() {
    if (confirmDelete !== "DELETE") return;
    setDeleting(true);
    setMessage("");
    try {
      if (mode === "demo" || !isSupabaseConfigured()) {
        clearLocalData();
        setMessage("Demo data deleted from this browser.");
        setConfirmDelete("");
        return;
      }

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Your session has expired. Please sign in again.");

      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ confirmation: "DELETE" }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to delete account.");

      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete account.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Account and preferences</p>
          <h1>Settings</h1>
          <p>Manage your profile, alerts, currency preferences, data exports, legal agreements, and account security.</p>
        </div>
      </section>

      {message && <p className={`form-message ${message.includes("successfully") || message.includes("cleared") || message.includes("saved") ? "success" : "error"}`}>{message}</p>}

      <div className="settings-grid">
        <section className="panel settings-section">
          <div className="settings-heading">
            <span><UserRound /></span>
            <div>
              <h2>Household profile</h2>
              <p>Personalize your household name, size, and preferred currency (PKR, INR, USD, etc.).</p>
            </div>
          </div>
          <div className="form-grid two">
            <label className="field">
              <span>Full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sarah Connor" />
            </label>
            <label className="field">
              <span>Household size</span>
              <input type="number" min="1" max="30" value={household} onChange={(e) => setHousehold(Number(e.target.value))} />
            </label>
            <label className="field">
              <span>Currency</span>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="PKR">PKR (Rs)</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </label>
            <label className="field">
              <span>Country</span>
              <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="PK, IN, US, UK, etc." />
            </label>
          </div>
          <div className="form-actions" style={{ marginTop: "1.25rem", justifyContent: "flex-start" }}>
            <button className="button button-primary" onClick={saveProfile} disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </section>

        <section className="panel settings-section">
          <div className="settings-heading">
            <span><Mail /></span>
            <div>
              <h2>Support contact</h2>
              <p>Need assistance or have privacy questions?</p>
            </div>
          </div>
          <div className="support-email">
            <Mail size={18} />
            <a href={`mailto:${supportEmail}`} className="link-text">{supportEmail}</a>
          </div>
          <p className="muted">Support queries are handled directly via email.</p>
        </section>

        <section className="panel settings-section full">
          <div className="settings-heading">
            <span><ShieldCheck /></span>
            <div>
              <h2>Browser notification alerts</h2>
              <p>Configure browser reminders for items expiring soon.</p>
            </div>
          </div>
          <NotificationPermission />
        </section>

        <section className="panel settings-section">
          <div className="settings-heading">
            <span><Download /></span>
            <div>
              <h2>Data export</h2>
              <p>Download your complete pantry, shopping, and activity records.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className="button button-soft" onClick={handleDownloadJSON}>
              <Download size={17} /> Download JSON
            </button>
            <button className="button button-soft" onClick={handleDownloadCSV}>
              <FileSpreadsheet size={17} /> Download CSV
            </button>
          </div>
        </section>

        <section className="panel settings-section">
          <div className="settings-heading">
            <span><RotateCcw /></span>
            <div>
              <h2>Manage stored data</h2>
              <p>Clear specific subsets of data safely.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="button button-ghost button-small" onClick={handleClearPantry}>Clear Pantry</button>
            <button className="button button-ghost button-small" onClick={handleClearShopping}>Clear Shopping List</button>
            <button className="button button-ghost button-small" onClick={handleClearHistory}>Clear Activity History</button>
          </div>
        </section>

        <section className="panel settings-section full">
          <div className="settings-heading">
            <span><ShieldCheck /></span>
            <div>
              <h2>Legal & Safety Terms</h2>
              <p>Review current terms, privacy policies, and safety advice.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.9rem" }}>
            <Link href="/privacy" target="_blank" className="link-text">Privacy Policy</Link>
            <Link href="/terms" target="_blank" className="link-text">Terms of Service</Link>
            <Link href="/food-safety" target="_blank" className="link-text">Food Safety Disclaimer</Link>
          </div>
        </section>

        <section className="panel settings-section danger-zone full">
          <div className="settings-heading">
            <span><Trash2 /></span>
            <div>
              <h2>Delete account and all household data</h2>
              <p>Permanently removes your user profile, pantry items, events, and login account. Type <strong>DELETE</strong> to confirm.</p>
            </div>
          </div>
          <div className="delete-row">
            <input
              aria-label="Type DELETE to confirm"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="Type DELETE"
            />
            <button className="button button-danger" disabled={confirmDelete !== "DELETE" || deleting} onClick={deleteAccount}>
              <Trash2 size={17} />
              {deleting ? "Deleting…" : "Delete account"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
