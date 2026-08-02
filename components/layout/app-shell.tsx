"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChartNoAxesColumnIncreasing, CirclePlus, ClipboardList, Gauge, Lightbulb, LogOut, Menu, PackageSearch, Search, Settings, ShoppingBasket, X } from "lucide-react";
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
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, mode, profile } = usePantry();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
  const current = navigation.find((item) => pathname.startsWith(item.href));

  const displayName = profile?.fullName || "Household";
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
            <div className="profile-chip">
              <span className="avatar">{avatarChar}</span>
              <span>
                <strong>{displayName}</strong>
                <small>{mode === "demo" ? "Demo Account" : "Household"}</small>
              </span>
            </div>
          </div>
        </header>

        <main className="content-area">{children}</main>
      </div>

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
