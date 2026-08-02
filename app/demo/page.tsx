"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CirclePlus, Info, RotateCcw, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { RiskBadge } from "@/components/ui/risk-badge";
import { samplePantryItems } from "@/lib/data/mock";
import { calculateRisk, expiryLabel } from "@/lib/risk";
import { formatCurrency } from "@/lib/currency";
import { PRODUCT_EMOJI } from "@/lib/constants";
import { OutcomeChart, WeeklyWasteChart, CategoryWasteChart } from "@/components/charts/dashboard-charts";
import { PantryProvider } from "@/lib/data/provider";
import { DemoSidebar } from "@/components/navigation/DemoSidebar";
import { DemoMobileNav } from "@/components/navigation/DemoMobileNav";
import { HeaderBackButton } from "@/components/ui/header-back-button";

function DemoContent() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "pantry" | "recommendations" | "insights">("dashboard");
  const [items, setItems] = useState(samplePantryItems);

  const available = items.filter((i) => i.status === "available");
  const ranked = available.map((item) => ({
    item,
    risk: calculateRisk(item, available.filter((other) => other.id !== item.id && other.productName.toLowerCase() === item.productName.toLowerCase()).length),
  })).sort((a, b) => b.risk.score - a.risk.score);

  const expiringSoon = ranked.filter(({ risk }) => risk.daysRemaining >= 0 && risk.daysRemaining <= 3).length;
  const atRiskValue = ranked.filter(({ risk }) => risk.level === "high" || risk.level === "expired").reduce((sum, { item }) => sum + item.price, 0);

  function markDemoConsumed(id: string) {
    setItems((cur) => cur.map((item) => (item.id === id ? { ...item, status: "consumed", statusDate: new Date().toISOString().slice(0, 10) } : item)));
  }

  function resetDemo() {
    setItems(samplePantryItems);
  }

  return (
    <div className="app-frame">
      {/* Shared Desktop Demo Sidebar */}
      <DemoSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onResetDemo={resetDemo}
        availableCount={available.length}
      />

      <div className="app-main">
        {/* Demo Top Banner */}
        <div style={{ background: "#eef7f2", borderBottom: "1px solid #cce8d8", color: "#0f7d53", padding: "0.6rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", fontWeight: 500 }}>
            <Info size={18} style={{ flexShrink: 0 }} />
            <span><strong>Sample demonstration data</strong> — Demo changes remain in local browser storage only.</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button type="button" onClick={resetDemo} className="button button-ghost button-small" style={{ gap: "0.3rem" }}>
              <RotateCcw size={14} /> Reset Demo
            </button>
            <Link href="/signup" className="button button-primary button-small" style={{ gap: "0.35rem" }}>
              Create free account <Sparkles size={14} />
            </Link>
          </div>
        </div>

        {/* Demo Header */}
        <header className="topbar">
          <div className="topbar-title">
            <span className="mobile-brand">
              <Logo compact />
            </span>
            <strong>Demo {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</strong>
          </div>

          <div className="topbar-actions" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <HeaderBackButton />
            <Link href="/signup" className="button button-primary button-small">
              Sign Up Free
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="content-area" style={{ padding: "1.25rem 1.25rem 6rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          {activeTab === "dashboard" && (
            <div className="page-stack">
              <section className="page-heading-row">
                <div>
                  <p className="eyebrow">Sample Overview</p>
                  <h1>Good morning, Demo Household <span aria-hidden="true">👋</span></h1>
                  <p>Review what needs attention in your demonstration pantry today. Figures use PKR formatting.</p>
                </div>
                <Link href="/signup" className="button button-primary">
                  <CirclePlus size={18} /> Start Your Pantry
                </Link>
              </section>

              <section className="stats-grid">
                <article className="stat-card">
                  <div>
                    <p>Available items</p>
                    <strong>{available.length}</strong>
                    <span>Currently stored</span>
                  </div>
                </article>
                <article className="stat-card">
                  <div>
                    <p>Expiring soon</p>
                    <strong>{expiringSoon}</strong>
                    <span>Within 3 days</span>
                  </div>
                </article>
                <article className="stat-card">
                  <div>
                    <p>Food value at risk</p>
                    <strong>{formatCurrency(atRiskValue, "PKR")}</strong>
                    <span>Requires action</span>
                  </div>
                </article>
                <article className="stat-card">
                  <div>
                    <p>Estimated saved</p>
                    <strong>{formatCurrency(3250, "PKR")}</strong>
                    <span>Timely consumption</span>
                  </div>
                </article>
              </section>

              <section className="dashboard-grid top">
                <article className="panel use-first-panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">Priority queue</p>
                      <h2>Use first</h2>
                    </div>
                    <button onClick={() => setActiveTab("pantry")} className="button button-ghost button-small">View all <ArrowRight size={15} /></button>
                  </div>
                  <div className="use-first-list">
                    {ranked.slice(0, 3).map(({ item, risk }) => (
                      <div className="use-first-item" key={item.id}>
                        <span className="use-first-visual">{PRODUCT_EMOJI[item.category] ?? "🛒"}</span>
                        <div className="use-first-copy">
                          <strong>{item.productName}</strong>
                          <span>{item.quantity} {item.unit} · {item.category}</span>
                          <small>{expiryLabel(risk.daysRemaining)}</small>
                        </div>
                        <div className="use-first-action">
                          <RiskBadge level={risk.level} score={risk.score} />
                          <button onClick={() => markDemoConsumed(item.id)} className="button button-soft button-small">
                            Mark consumed
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">Demo outcomes</p>
                      <h2>Food outcome balance</h2>
                    </div>
                  </div>
                  <OutcomeChart />
                  <small className="muted" style={{ display: "block", marginTop: "0.5rem", fontSize: "0.72rem" }}>
                    Demo efficiency is calculated as (consumed items / total resolved items) × 100% based on sample records held in local browser storage.
                  </small>
                </article>
              </section>
            </div>
          )}

          {activeTab === "pantry" && (
            <div className="page-stack">
              <section className="page-heading-row">
                <div>
                  <p className="eyebrow">Demo Inventory</p>
                  <h1>Sample Pantry</h1>
                  <p>{available.length} sample items available.</p>
                </div>
              </section>
              <div className="product-grid">
                {available.map((item) => {
                  const risk = calculateRisk(item);
                  return (
                    <article key={item.id} className="panel product-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "2rem" }}>{PRODUCT_EMOJI[item.category] ?? "🛒"}</span>
                        <RiskBadge level={risk.level} score={risk.score} />
                      </div>
                      <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{item.productName}</h3>
                      <p className="muted" style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                        {item.quantity} {item.unit} · {item.storageLocation}
                      </p>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted-color)", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span>{expiryLabel(risk.daysRemaining)}</span>
                        <span>Price: {formatCurrency(item.price, "PKR")}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "recommendations" && (
            <div className="page-stack">
              <section className="page-heading-row">
                <div>
                  <p className="eyebrow">Demo Planning</p>
                  <h1>Smart Recommendations</h1>
                  <p>Suggested recipes and storage tips based on items expiring soon.</p>
                </div>
              </section>
              <div style={{ display: "grid", gap: "1rem" }}>
                <article className="panel">
                  <h3>🍲 Make a Fresh Vegetable Soup</h3>
                  <p className="muted" style={{ marginTop: "0.5rem" }}>Uses your Tomatoes, Spinach, and Carrots expiring in 2 days.</p>
                </article>
                <article className="panel">
                  <h3>🍌 Freeze Overripe Bananas</h3>
                  <p className="muted" style={{ marginTop: "0.5rem" }}>Slice bananas and freeze them in sealed bags for smoothies or baking.</p>
                </article>
              </div>
            </div>
          )}

          {activeTab === "insights" && (
            <div className="page-stack">
              <section className="page-heading-row">
                <div>
                  <p className="eyebrow">Demo Analytics</p>
                  <h1>Household Insights</h1>
                  <p>Overview of sample food outcomes and waste prevention.</p>
                </div>
              </section>
              <div className="dashboard-grid top">
                <article className="panel">
                  <h3>Waste Trend</h3>
                  <WeeklyWasteChart />
                </article>
                <article className="panel">
                  <h3>Waste by Category</h3>
                  <CategoryWasteChart />
                </article>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Shared Mobile Demo Navigation */}
      <DemoMobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onResetDemo={resetDemo}
      />
    </div>
  );
}

export default function DemoPage() {
  return (
    <PantryProvider>
      <DemoContent />
    </PantryProvider>
  );
}
