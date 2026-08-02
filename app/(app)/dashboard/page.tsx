"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CirclePlus, Clock3, Leaf, PackageCheck, PiggyBank, TriangleAlert } from "lucide-react";
import { OutcomeChart, WeeklyWasteChart } from "@/components/charts/dashboard-charts";
import { useExpiryNotifications } from "@/components/notifications/notification-permission";
import { RiskBadge } from "@/components/ui/risk-badge";
import { PRODUCT_EMOJI } from "@/lib/constants";
import { usePantry } from "@/lib/data/provider";
import { calculateRisk, expiryLabel, formatCurrency } from "@/lib/risk";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatEventTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export default function DashboardPage() {
  const { items, events, loading, markStatus, profile } = usePantry();
  useExpiryNotifications(items);

  const [greetingText, setGreetingText] = useState("Good day");
  const [dateFormatted, setDateFormatted] = useState("");

  useEffect(() => {
    const now = new Date();
    setGreetingText(getGreeting(now.getHours()));
    setDateFormatted(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }));
  }, []);

  const userName = profile?.fullName || "Household";
  const userCurrency = profile?.currency || "USD";

  const available = items.filter((item) => item.status === "available");
  const ranked = available.map((item) => ({
    item,
    risk: calculateRisk(item, available.filter((other) => other.id !== item.id && other.productName.toLowerCase() === item.productName.toLowerCase()).length),
  })).sort((a, b) => b.risk.score - a.risk.score);

  const expiringSoon = ranked.filter(({ risk }) => risk.daysRemaining >= 0 && risk.daysRemaining <= 3).length;
  const atRiskValue = ranked.filter(({ risk }) => risk.level === "high" || risk.level === "expired").reduce((sum, { item }) => sum + item.price, 0);

  // Calculated stats from actual items (NO fake additions)
  const currentMonthPrefix = new Date().toISOString().slice(0, 7);
  const consumedThisMonth = items.filter((item) => item.status === "consumed" && (item.statusDate?.startsWith(currentMonthPrefix) || item.updatedAt.startsWith(currentMonthPrefix)));
  const savedValueThisMonth = consumedThisMonth.reduce((sum, item) => sum + item.price, 0);

  const recentEvents = events.slice(0, 5);

  return (
    <div className="page-stack">
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">{dateFormatted || "Today's overview"}</p>
          <h1>
            {greetingText}, {userName} <span aria-hidden="true">👋</span>
          </h1>
          <p>Here is what needs attention in your pantry today.</p>
        </div>
        <Link href="/add-item" className="button button-primary">
          <CirclePlus size={18} /> Add grocery
        </Link>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon green"><PackageCheck /></span>
          <div>
            <p>Available items</p>
            <strong>{loading ? "—" : available.length}</strong>
            <span>Currently stored</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon amber"><Clock3 /></span>
          <div>
            <p>Expiring soon</p>
            <strong>{loading ? "—" : expiringSoon}</strong>
            <span>Within next 3 days</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon red"><TriangleAlert /></span>
          <div>
            <p>Food value at risk</p>
            <strong>{loading ? "—" : formatCurrency(atRiskValue, userCurrency)}</strong>
            <span>High risk or expired</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon lime"><PiggyBank /></span>
          <div>
            <p>Saved this month</p>
            <strong>{loading ? "—" : formatCurrency(savedValueThisMonth, userCurrency)}</strong>
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
            <Link href="/pantry">View all <ArrowRight size={15} /></Link>
          </div>

          {ranked.length === 0 ? (
            <div style={{ padding: "2rem 1rem", textAlign: "center", color: "var(--muted-color)" }}>
              <p>No available groceries in your pantry.</p>
              <Link href="/add-item" className="button button-soft button-small" style={{ marginTop: "0.75rem" }}>
                Add your first item
              </Link>
            </div>
          ) : (
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
                    <button onClick={() => markStatus(item.id, "consumed")} className="button button-soft button-small">
                      Mark consumed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Household performance</p>
              <h2>Food outcome overview</h2>
            </div>
          </div>
          <OutcomeChart />
        </article>
      </section>

      <section className="dashboard-grid bottom">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Last seven days</p>
              <h2>Weekly waste trend</h2>
            </div>
          </div>
          <WeeklyWasteChart />
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Latest activity</p>
              <h2>Recent actions</h2>
            </div>
            <Link href="/notifications">View notifications</Link>
          </div>

          {recentEvents.length === 0 ? (
            <div style={{ padding: "1.5rem 1rem", color: "var(--muted-color)", fontSize: "0.9rem" }}>
              No recorded inventory actions yet. Add or update items to build your activity history.
            </div>
          ) : (
            <div className="activity-list">
              {recentEvents.map((evt) => {
                const prodName = (evt.details?.productName as string) || "Pantry item";
                const eventText = evt.eventType === "item_added"
                  ? `Added ${prodName}`
                  : evt.eventType === "marked_consumed"
                    ? `Consumed ${prodName}`
                    : evt.eventType === "marked_wasted"
                      ? `Recorded waste for ${prodName}`
                      : evt.eventType === "marked_donated"
                        ? `Donated ${prodName}`
                        : `${prodName} updated`;
                const tone = evt.eventType.includes("consumed") || evt.eventType.includes("added") ? "green" : evt.eventType.includes("wasted") ? "red" : "amber";
                return (
                  <div key={evt.id}>
                    <span className={`activity-dot ${tone}`} />
                    <div>
                      <strong>{eventText}</strong>
                      <small>{formatEventTime(evt.createdAt)}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </section>

      <p className="safety-note">
        <TriangleAlert size={15} /> PantryPulse provides planning estimates only. Always follow package labels and official food-safety guidance.
      </p>
    </div>
  );
}
