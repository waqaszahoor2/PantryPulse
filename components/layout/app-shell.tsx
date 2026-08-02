"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationPermission } from "@/components/notifications/notification-permission";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { AppMobileNav } from "@/components/navigation/AppMobileNav";
import { UserMenu } from "@/components/navigation/UserMenu";
import { AUTH_NAV_ITEMS } from "@/config/navigation";
import { usePantry } from "@/lib/data/provider";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { notifications } = usePantry();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
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

          <div className="topbar-actions">
            <NotificationPermission compact />
            <ThemeToggle />
            <Link
              className="icon-button notification-button"
              href="/notifications"
              aria-label={`${unreadCount} unread notifications`}
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
            </Link>

            {/* Dynamic Authenticated User Menu */}
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
