"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, LogOut, Mail, Settings, User, UserCheck, Users, X } from "lucide-react";
import { usePantry } from "@/lib/data/provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function UserMenu() {
  const router = useRouter();
  const { profile, mode } = usePantry();
  const [modalOpen, setModalOpen] = useState(false);

  const rawName = profile?.fullName?.trim() || profile?.email?.split("@")[0] || "Household User";
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const avatarChar = displayName.charAt(0).toUpperCase() || "H";

  async function handleSignOut() {
    if (mode === "supabase" && isSupabaseConfigured()) {
      try {
        await createClient().auth.signOut();
      } catch {
        // Continue redirecting on error
      }
    }
    setModalOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        className="profile-chip"
        onClick={() => setModalOpen(true)}
        style={{ background: "transparent", border: 0, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "0.6rem" }}
        aria-label={`View account profile for ${displayName}`}
      >
        <span className="avatar" style={{ overflow: "hidden", width: "36px", height: "36px", borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, flexShrink: 0 }}>
          {profile?.avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={profile.avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            avatarChar
          )}
        </span>
        <span className="profile-chip-copy" style={{ display: "grid", lineHeight: "1.2" }}>
          <strong style={{ fontSize: "0.85rem", color: "var(--text)" }}>{displayName}</strong>
          <small className="muted" style={{ fontSize: "0.72rem" }}>{mode === "demo" ? "Demo Sandbox" : "Household Account"}</small>
        </span>
      </button>

      {/* Account Details Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)} style={{ zIndex: 1050 }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px" }}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={20} style={{ color: "var(--primary)" }} />
                <h2>User Account Details</h2>
              </div>
              <button className="icon-button subtle" onClick={() => setModalOpen(false)} aria-label="Close profile details">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "1rem 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ width: "84px", height: "84px", borderRadius: "50%", overflow: "hidden", border: "3px solid var(--primary)", background: "var(--surface-soft)", display: "grid", placeItems: "center", marginBottom: "0.75rem" }}>
                {profile?.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={profile.avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary)" }}>{avatarChar}</span>
                )}
              </div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--text)" }}>{displayName}</h3>
              <p className="muted" style={{ fontSize: "0.82rem", margin: "0.2rem 0 0" }}>{profile?.email || "demo@pantrypulse.app"}</p>
            </div>

            <div style={{ display: "grid", gap: "0.75rem", margin: "1rem 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.75rem", background: "var(--surface-soft)", borderRadius: "10px", fontSize: "0.85rem" }}>
                <span className="muted" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Mail size={15} /> Email:
                </span>
                <strong style={{ color: "var(--text)" }}>{profile?.email || "demo@pantrypulse.app"}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.75rem", background: "var(--surface-soft)", borderRadius: "10px", fontSize: "0.85rem" }}>
                <span className="muted" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <UserCheck size={15} /> Gender:
                </span>
                <strong style={{ color: "var(--text)" }}>{profile?.gender || "Prefer not to say"}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.75rem", background: "var(--surface-soft)", borderRadius: "10px", fontSize: "0.85rem" }}>
                <span className="muted" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Users size={15} /> Household Size:
                </span>
                <strong style={{ color: "var(--text)" }}>{profile?.householdSize || 1} {profile?.householdSize === 1 ? "person" : "people"}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.75rem", background: "var(--surface-soft)", borderRadius: "10px", fontSize: "0.85rem" }}>
                <span className="muted" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Globe size={15} /> Currency / Country:
                </span>
                <strong style={{ color: "var(--text)" }}>{profile?.currency || "PKR"} ({profile?.country || "PK"})</strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <Link
                href="/settings"
                className="button button-primary button-full"
                onClick={() => setModalOpen(false)}
              >
                <Settings size={16} /> Edit Profile
              </Link>
              <button
                className="button button-soft"
                onClick={handleSignOut}
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
