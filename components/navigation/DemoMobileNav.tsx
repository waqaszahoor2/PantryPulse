"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChartNoAxesColumnIncreasing,
  Gauge,
  Info,
  Lightbulb,
  LogOut,
  Menu,
  PackageSearch,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { MobileMenuDrawer } from "@/components/navigation/MobileMenuDrawer";

interface DemoMobileNavProps {
  activeTab: string;
  onTabChange: (tab: "dashboard" | "pantry" | "recommendations" | "insights") => void;
  onResetDemo: () => void;
}

export function DemoMobileNav({ activeTab, onTabChange, onResetDemo }: DemoMobileNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);

  function handleReset() {
    onResetDemo();
    setMoreOpen(false);
  }

  return (
    <>
      <nav className="mobile-nav" aria-label="Demo mobile navigation">
        <button
          type="button"
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => onTabChange("dashboard")}
          aria-current={activeTab === "dashboard" ? "page" : undefined}
        >
          <Gauge size={20} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={activeTab === "pantry" ? "active" : ""}
          onClick={() => onTabChange("pantry")}
          aria-current={activeTab === "pantry" ? "page" : undefined}
        >
          <PackageSearch size={20} />
          <span>Pantry</span>
        </button>

        <Link href="/signup" className="mobile-add" aria-label="Create account for full access">
          <Sparkles size={24} />
        </Link>

        <button
          type="button"
          className={activeTab === "recommendations" ? "active" : ""}
          onClick={() => onTabChange("recommendations")}
          aria-current={activeTab === "recommendations" ? "page" : undefined}
        >
          <Lightbulb size={20} />
          <span>Tips</span>
        </button>

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={activeTab === "insights" ? "active" : ""}
          aria-label="More demo options"
        >
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>

      <MobileMenuDrawer isOpen={moreOpen} onClose={() => setMoreOpen(false)} title="Demo Navigation Menu">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ padding: "0.6rem 0.85rem", background: "rgba(20,160,105,0.12)", border: "1px solid rgba(20,160,105,0.25)", borderRadius: "10px", fontSize: "0.8rem", color: "var(--primary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 750 }}>
              <Info size={15} /> Sample demonstration data
            </div>
            <span style={{ fontSize: "0.72rem", opacity: 0.85, display: "block", marginTop: "0.2rem" }}>
              Demo changes remain in local browser storage only.
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onTabChange("recommendations");
              setMoreOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.85rem 1rem",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#fff",
              background: activeTab === "recommendations" ? "var(--primary)" : "rgba(255,255,255,0.05)",
              border: 0,
              minHeight: "48px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <Lightbulb size={20} />
            <span>Recommendations</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onTabChange("insights");
              setMoreOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.85rem 1rem",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#fff",
              background: activeTab === "insights" ? "var(--primary)" : "rgba(255,255,255,0.05)",
              border: 0,
              minHeight: "48px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <ChartNoAxesColumnIncreasing size={20} />
            <span>Insights</span>
          </button>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", margin: "0.5rem 0" }} />

          <button
            type="button"
            onClick={handleReset}
            className="button button-soft button-full"
            style={{ minHeight: "48px", fontSize: "0.95rem", gap: "0.5rem" }}
          >
            <RotateCcw size={18} /> Reset Demo Data
          </button>

          <Link
            href="/"
            className="button button-ghost button-full"
            style={{ minHeight: "48px", fontSize: "0.95rem", gap: "0.5rem", color: "rgba(255,255,255,0.8)" }}
          >
            <LogOut size={18} /> Exit Demo
          </Link>

          <Link
            href="/signup"
            className="button button-primary button-full"
            style={{ minHeight: "48px", fontSize: "0.95rem", gap: "0.5rem", marginTop: "0.25rem" }}
          >
            <Sparkles size={18} /> Create Free Account
          </Link>
        </div>
      </MobileMenuDrawer>
    </>
  );
}
