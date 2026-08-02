"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, CircleDollarSign, PackageCheck, PiggyBank, Trash2 } from "lucide-react";
import { CategoryWasteChart, MoneySavedVsLostChart, OutcomeChart, WeeklyWasteChart } from "@/components/charts/dashboard-charts";
import { usePantry } from "@/lib/data/provider";
import { formatCurrency } from "@/lib/risk";

export default function InsightsPage() {
  const { items, profile } = usePantry();
  const [period, setPeriod] = useState("All time");

  const userCurrency = profile?.currency || "USD";

  const stats = useMemo(() => {
    const consumed = items.filter((item) => item.status === "consumed");
    const wasted = items.filter((item) => item.status === "wasted" || item.status === "expired");
    const donated = items.filter((item) => item.status === "donated");

    const lost = wasted.reduce((sum, item) => sum + item.price, 0);
    const saved = consumed.reduce((sum, item) => sum + item.price, 0);

    const totalResolved = consumed.length + wasted.length + donated.length;
    const efficiency = totalResolved > 0 ? Math.round((consumed.length / totalResolved) * 100) : 100;

    return {
      consumedCount: consumed.length,
      wastedCount: wasted.length,
      donatedCount: donated.length,
      lost,
      saved,
      efficiency,
    };
  }, [items]);

  return (
    <div className="page-stack">
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Household analytics</p>
          <h1>Insights</h1>
          <p>Review your food outcomes and estimated financial impact based on recorded items.</p>
        </div>
        <select className="period-select" aria-label="Reporting period" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="All time">All time</option>
        </select>
      </section>

      <section className="stats-grid insights">
        <article className="stat-card">
          <span className="stat-icon green"><PackageCheck /></span>
          <div>
            <p>Food consumed</p>
            <strong>{stats.consumedCount} items</strong>
            <span className="positive">{stats.efficiency}% efficiency rate</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon red"><Trash2 /></span>
          <div>
            <p>Food wasted</p>
            <strong>{stats.wastedCount} items</strong>
            <span>{stats.wastedCount === 0 ? "Zero waste!" : "Recorded loss"}</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon lime"><PiggyBank /></span>
          <div>
            <p>Estimated saved</p>
            <strong>{formatCurrency(stats.saved, userCurrency)}</strong>
            <span>Timely consumption</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon amber"><CircleDollarSign /></span>
          <div>
            <p>Estimated lost</p>
            <strong>{formatCurrency(stats.lost, userCurrency)}</strong>
            <span>Recorded waste</span>
          </div>
        </article>
      </section>

      <section className="dashboard-grid bottom">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Outcome balance</p>
              <h2>Consumed vs Wasted vs Donated</h2>
            </div>
          </div>
          <OutcomeChart />
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Most affected groups</p>
              <h2>Waste by category</h2>
            </div>
          </div>
          <CategoryWasteChart />
        </article>
      </section>

      <section className="dashboard-grid bottom">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Financial breakdown</p>
              <h2>Money saved vs lost</h2>
            </div>
          </div>
          <MoneySavedVsLostChart />
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Weekly pattern</p>
              <h2>Waste trend</h2>
            </div>
          </div>
          <WeeklyWasteChart />
        </article>
      </section>
    </div>
  );
}
