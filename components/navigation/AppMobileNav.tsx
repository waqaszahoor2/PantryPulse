"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChartNoAxesColumnIncreasing,
  CirclePlus,
  Gauge,
  HelpCircle,
  Lightbulb,
  LogOut,
  Menu,
  PackageSearch,
  Settings,
  ShoppingBasket,
} from "lucide-react";
import { MobileMenuDrawer } from "@/components/navigation/MobileMenuDrawer";
import { usePantry } from "@/lib/data/provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AppMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, mode, profile } = usePantry();
  const [moreOpen, setMoreOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((i) => !i.read).length, [notifications]);
  const displayName = profile?.fullName || "Household User";

  async function handleSignOut() {
    if (mode === "supabase" && isSupabaseConfigured()) {
      try {
        await createClient().auth.signOut();
      } catch {
        // Continue redirecting on error
      }
    }
    setMoreOpen(false);
    router.push("/");
    router.refresh();
  }

  const moreItems = [
    { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
    { href: "/insights", label: "Insights", icon: ChartNoAxesColumnIncreasing },
    { href: "/notifications", label: "Notifications", icon: Bell, count: unreadCount },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/support", label: "Support", icon: HelpCircle },
  ];

  return (
    <>
      <nav className="mobile-nav" aria-label="App mobile navigation">
        <Link
          href="/dashboard"
          className={pathname.startsWith("/dashboard") ? "active" : ""}
          aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
        >
          <Gauge size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/pantry"
          className={pathname.startsWith("/pantry") ? "active" : ""}
          aria-current={pathname.startsWith("/pantry") ? "page" : undefined}
        >
          <PackageSearch size={20} />
          <span>Pantry</span>
        </Link>

        <Link href="/add-item" className="mobile-add" aria-label="Add grocery item">
          <CirclePlus size={26} />
        </Link>

        <Link
          href="/shopping-list"
          className={pathname.startsWith("/shopping-list") ? "active" : ""}
          aria-current={pathname.startsWith("/shopping-list") ? "page" : undefined}
        >
          <ShoppingBasket size={20} />
          <span>Shopping</span>
        </Link>

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={moreItems.some((item) => pathname.startsWith(item.href)) ? "active" : ""}
          aria-label="More navigation options"
        >
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>

      <MobileMenuDrawer isOpen={moreOpen} onClose={() => setMoreOpen(false)} title="More Navigation Options">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem", color: "var(--muted, rgba(255,255,255,0.7))", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "0.25rem" }}>
            Signed in as <strong>{displayName}</strong>
          </div>

          {moreItems.map(({ href, label, icon: Icon, count }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMoreOpen(false)}
                aria-current={active ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#fff",
                  background: active ? "var(--primary)" : "rgba(255,255,255,0.05)",
                  minHeight: "48px",
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Icon size={20} />
                  <span>{label}</span>
                </div>
                {count !== undefined && count > 0 && (
                  <span className="nav-count" style={{ background: "var(--red)", color: "#fff", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem" }}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}

          <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", margin: "0.75rem 0" }} />

          <button
            type="button"
            onClick={handleSignOut}
            className="button button-soft button-full"
            style={{ minHeight: "48px", color: "#ff7b7b", borderColor: "rgba(255,123,123,0.3)" }}
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </MobileMenuDrawer>
    </>
  );
}
