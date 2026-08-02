"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Camera, ChartNoAxesColumnIncreasing, CirclePlus, ClipboardList, Gauge, Globe, HelpCircle, Home, Lightbulb, LogOut, Mail, Menu, PackageSearch, Search, Settings, ShoppingBasket, User, UserCheck, Users, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationPermission } from "@/components/notifications/notification-permission";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { usePantry } from "@/lib/data/provider";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/pantry", label: "My Pantry", icon: PackageSearch },
  { href: "/add-item", label: "Add Grocery", icon: CirclePlus },
  { href: "/shopping-list", label: "Shopping List", icon: ShoppingBasket },
  { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/insights", label: "Insights", icon: ChartNoAxesColumnIncreasing },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/support", label: "Support", icon: HelpCircle },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, mode, profile } = usePantry();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const unread = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
  const current = navigation.find((item) => pathname.startsWith(item.href));

  const displayName = profile?.fullName || "Household User";
  const avatarChar = displayName.charAt(0).toUpperCase() || "H";

  async function signOut() {
    if (mode === "supabase" && isSupabaseConfigured()) {
      await createClient().auth.signOut();
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="app-frame">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-head">
          <Logo />
          <button className="icon-button sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`nav-link ${active ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                <Icon size={18} />
                <span>{label}</span>
                {label === "Notifications" && unread > 0 && <span className="nav-count">{unread}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <div className="mode-card">
            <ClipboardList size={18} />
            <div>
              <strong>{mode === "demo" ? "Demo sandbox" : "Live database"}</strong>
              <span>{mode === "demo" ? "Local storage" : "Synced with Supabase"}</span>
            </div>
          </div>
          <button className="nav-link nav-button" onClick={signOut}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <button className="scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-title">
            <button className="icon-button menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu size={20} />
            </button>
            <div>
              <span className="mobile-brand"><Logo compact /></span>
              <strong>{current?.label ?? "PantryPulse"}</strong>
            </div>
          </div>

          <label className="global-search">
            <Search size={17} />
            <input aria-label="Search PantryPulse" placeholder="Search food, categories, pages…" />
          </label>

          <div className="topbar-actions">
            <NotificationPermission compact />
            <ThemeToggle />
            <Link className="icon-button notification-button" href="/notifications" aria-label={`${unread} unread notifications`}>
              <Bell size={18} />
              {unread > 0 && <span className="notification-dot">{unread}</span>}
            </Link>

            {/* Clickable Profile Chip */}
            <button
              className="profile-chip"
              onClick={() => setProfileModalOpen(true)}
              style={{ background: "transparent", border: 0, cursor: "pointer", textAlign: "left" }}
              aria-label="View Account Profile Details"
            >
              <span className="avatar" style={{ overflow: "hidden", padding: 0 }}>
                {profile?.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={profile.avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  avatarChar
                )}
              </span>
              <span>
                <strong>{displayName}</strong>
                <small>{mode === "demo" ? "Demo Account" : "Household"}</small>
              </span>
            </button>
          </div>
        </header>

        <main className="content-area">{children}</main>
      </div>

      {/* Account Details Modal */}
      {profileModalOpen && (
        <div className="modal-backdrop" onClick={() => setProfileModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "460px" }}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={20} style={{ color: "var(--primary)" }} />
                <h2>User Account Details</h2>
              </div>
              <button className="icon-button subtle" onClick={() => setProfileModalOpen(false)} aria-label="Close profile details">
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
                onClick={() => setProfileModalOpen(false)}
              >
                <Settings size={16} /> Edit Profile & Picture
              </Link>
              <button
                className="button button-soft"
                onClick={() => {
                  setProfileModalOpen(false);
                  signOut();
                }}
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.slice(0, 2).map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={pathname.startsWith(href) ? "active" : ""}>
            <Icon size={20} />
            <span>{label === "My Pantry" ? "Pantry" : label}</span>
          </Link>
        ))}
        <Link href="/add-item" className="mobile-add" aria-label="Add grocery">
          <CirclePlus size={29} />
        </Link>
        <Link href="/shopping-list" className={pathname.startsWith("/shopping-list") ? "active" : ""}>
          <ShoppingBasket size={20} />
          <span>Shopping</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className={pathname.startsWith("/settings") ? "active" : ""}>
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
