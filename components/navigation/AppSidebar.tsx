"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, LogOut, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { AUTH_NAV_ITEMS } from "@/config/navigation";
import { usePantry } from "@/lib/data/provider";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AppSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({ mobileOpen = false, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, mode } = usePantry();

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  async function handleSignOut() {
    if (mode === "supabase" && isSupabaseConfigured()) {
      try {
        await createClient().auth.signOut();
      } catch {
        // Continue redirecting on error
      }
    }
    if (onCloseMobile) onCloseMobile();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`} style={{ zIndex: 1000 }}>
      <div className="sidebar-head">
        <Logo />
        {onCloseMobile && (
          <button className="icon-button sidebar-close" onClick={onCloseMobile} aria-label="Close navigation sidebar">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Authenticated sidebar navigation">
        {AUTH_NAV_ITEMS.map(({ href, label, icon: Icon, badgeKey }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={onCloseMobile}
            >
              {Icon && <Icon size={18} />}
              <span>{label}</span>
              {badgeKey === "notifications" && unreadCount > 0 && (
                <span className="nav-count" aria-label={`${unreadCount} unread notifications`}>
                  {unreadCount}
                </span>
              )}
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
        <button type="button" className="nav-link nav-button" onClick={handleSignOut}>
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
