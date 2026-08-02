"use client";

import Link from "next/link";
import { ArrowRight, CirclePlus, Clock3, Leaf, PackageCheck, PiggyBank, TriangleAlert } from "lucide-react";
import { OutcomeChart, WeeklyWasteChart } from "@/components/charts/dashboard-charts";
import { useExpiryNotifications } from "@/components/notifications/notification-permission";
import { RiskBadge } from "@/components/ui/risk-badge";
import { PRODUCT_EMOJI } from "@/lib/constants";
import { usePantry } from "@/lib/data/provider";
import { calculateRisk, expiryLabel } from "@/lib/risk";

export default function DashboardPage() {
  const { items, loading, markStatus } = usePantry();
  useExpiryNotifications(items);
  const available = items.filter((item) => item.status === "available");
  const ranked = available.map((item) => ({ item, risk: calculateRisk(item, available.filter((other) => other.id !== item.id && other.productName.toLowerCase() === item.productName.toLowerCase()).length) })).sort((a,b)=>b.risk.score-a.risk.score);
  const expiringSoon = ranked.filter(({risk})=>risk.daysRemaining >= 0 && risk.daysRemaining <= 3).length;
  const atRiskValue = ranked.filter(({risk})=>risk.level === "high" || risk.level === "expired").reduce((sum,{item})=>sum+item.price,0);
  const consumedValue = items.filter((item)=>item.status === "consumed").reduce((sum,item)=>sum+item.price,0) + 3250;

  return <div className="page-stack">
    <section className="page-heading-row"><div><p className="eyebrow">Sunday overview</p><h1>Good evening, Ali <span aria-hidden="true">👋</span></h1><p>Here is what needs attention in your pantry today.</p></div><Link href="/add-item" className="button button-primary"><CirclePlus size={18}/> Add grocery</Link></section>
    <section className="stats-grid">
      <article className="stat-card"><span className="stat-icon green"><PackageCheck/></span><div><p>Available items</p><strong>{loading ? "—" : available.length}</strong><span>Currently stored</span></div></article>
      <article className="stat-card"><span className="stat-icon amber"><Clock3/></span><div><p>Expiring soon</p><strong>{loading ? "—" : expiringSoon}</strong><span>Within the next 3 days</span></div></article>
      <article className="stat-card"><span className="stat-icon red"><TriangleAlert/></span><div><p>Food value at risk</p><strong>PKR {atRiskValue.toLocaleString()}</strong><span>Possible loss</span></div></article>
      <article className="stat-card"><span className="stat-icon lime"><PiggyBank/></span><div><p>Saved this month</p><strong>PKR {consumedValue.toLocaleString()}</strong><span>Estimated timely use</span></div></article>
    </section>
    <section className="dashboard-grid top">
      <article className="panel use-first-panel"><div className="panel-header"><div><p className="eyebrow">Priority queue</p><h2>Use first</h2></div><Link href="/pantry">View all <ArrowRight size={15}/></Link></div><div className="use-first-list">{ranked.slice(0,3).map(({item,risk})=><div className="use-first-item" key={item.id}><span className="use-first-visual">{PRODUCT_EMOJI[item.category] ?? "🛒"}</span><div className="use-first-copy"><strong>{item.productName}</strong><span>{item.quantity} {item.unit} · {item.category}</span><small>{expiryLabel(risk.daysRemaining)}</small></div><div className="use-first-action"><RiskBadge level={risk.level}/><button onClick={()=>markStatus(item.id,"consumed")} className="button button-soft button-small">Mark consumed</button></div></div>)}</div></article>
      <article className="panel"><div className="panel-header"><div><p className="eyebrow">Household performance</p><h2>Food outcome overview</h2></div></div><OutcomeChart/></article>
    </section>
    <section className="dashboard-grid bottom">
      <article className="panel"><div className="panel-header"><div><p className="eyebrow">Last seven days</p><h2>Weekly food-waste trend</h2></div><span className="trend-chip"><Leaf size={14}/> 18% less</span></div><WeeklyWasteChart/></article>
      <article className="panel"><div className="panel-header"><div><p className="eyebrow">Latest updates</p><h2>Recent activity</h2></div><Link href="/notifications">View all</Link></div><div className="activity-list">{[
        ["Milk added to pantry", "Today, 10:34 AM", "green"],
        ["Bread marked as consumed", "Today, 9:20 AM", "green"],
        ["Tomatoes moved to refrigerator", "Yesterday, 6:15 PM", "amber"],
        ["Bananas recorded as wasted", "Yesterday, 4:40 PM", "red"],
      ].map(([text,time,tone])=><div key={text}><span className={`activity-dot ${tone}`}/><div><strong>{text}</strong><small>{time}</small></div></div>)}</div></article>
    </section>
    <p className="safety-note"><TriangleAlert size={15}/> PantryPulse provides planning estimates only. Always follow product labels and official food-safety guidance.</p>
  </div>;
}
