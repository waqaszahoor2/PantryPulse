"use client";

import Link from "next/link";
import {
  ChartNoAxesColumnIncreasing,
  CirclePlus,
  Gauge,
  Info,
  Lightbulb,
  LogOut,
  PackageSearch,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { DEMO_NAV_ITEMS } from "@/config/navigation";

interface DemoSidebarProps {
  activeTab: string;
  onTabChange: (tab: "dashboard" | "pantry" | "recommendations" | "insights") => void;
  onResetDemo: () => void;
  availableCount: number;
}

export function DemoSidebar({ activeTab, onTabChange, onResetDemo, availableCount }: DemoSidebarProps) {
  return (
    <aside className="sidebar" style={{ zIndex: 100 }}>
      <div className="sidebar-head">
        <Logo />
      </div>

      <div style={{ padding: "0.5rem 1rem", margin: "0.5rem 1rem", background: "rgba(20,160,105,0.12)", border: "1px solid rgba(20,160,105,0.25)", borderRadius: "10px", fontSize: "0.76rem", color: "var(--primary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 750 }}>
          <Info size={14} /> Demo Mode
        </div>
        <span style={{ fontSize: "0.7rem", opacity: 0.85, display: "block", marginTop: "0.15rem" }}>
          Sample demonstration data
        </span>
      </div>

      <nav className="sidebar-nav" aria-label="Demo sidebar navigation">
        {DEMO_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = activeTab === href;
          return (
            <button
              key={href}
              type="button"
              className={`nav-link ${active ? "active" : ""}`}
              onClick={() => onTabChange(href as any)}
              aria-current={active ? "page" : undefined}
            >
              {Icon && <Icon size={18} />}
              <span>{label === "Pantry" ? `Pantry (${availableCount})` : label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-foot" style={{ display: "grid", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={onResetDemo}
          className="button button-soft button-small button-full"
          style={{ gap: "0.4rem" }}
        >
          <RotateCcw size={15} /> Reset Demo
        </button>

        <Link
          href="/"
          className="button button-ghost button-small button-full"
          style={{ gap: "0.4rem", color: "rgba(255,255,255,0.8)" }}
        >
          <LogOut size={15} /> Exit Demo
        </Link>

        <Link
          href="/signup"
          className="button button-primary button-small button-full"
          style={{ gap: "0.4rem", marginTop: "0.25rem" }}
        >
          <Sparkles size={15} /> Create Free Account
        </Link>
      </div>
    </aside>
  );
}
