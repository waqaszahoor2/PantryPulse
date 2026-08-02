"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationPermission } from "@/components/notifications/notification-permission";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { AppMobileNav } from "@/components/navigation/AppMobileNav";
import { UserMenu } from "@/components/navigation/UserMenu";
import { LiveClock } from "@/components/navigation/LiveClock";
import { NotificationButton } from "@/components/notifications/NotificationButton";
import { AUTH_NAV_ITEMS } from "@/config/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentNavItem = AUTH_NAV_ITEMS.find((item) => pathname.startsWith(item.href));

  return (
    <div className="app-frame">
      <AppSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {mobileOpen && (
        <button
          type="button"
          className="scrim"
          aria-label="Close menu backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-title">
            <button
              type="button"
              className="icon-button menu-button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <span className="mobile-brand">
                <Logo compact />
              </span>
              <strong>{currentNavItem?.label ?? "PantryPulse"}</strong>
            </div>
          </div>

          <label className="global-search">
            <Search size={17} />
            <input aria-label="Search PantryPulse" placeholder="Search food, categories, pages…" />
          </label>

          <div className="topbar-actions" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <LiveClock />
            <NotificationPermission compact />
            <ThemeToggle />
            <NotificationButton />
            <UserMenu />
          </div>
        </header>

        <main className="content-area">{children}</main>
      </div>

      {/* Shared Authenticated Mobile Bottom Bar */}
      <AppMobileNav />
    </div>
  );
}
