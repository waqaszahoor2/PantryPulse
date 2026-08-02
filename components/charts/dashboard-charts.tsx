"use client";

import { useMemo } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts";
import { usePantry } from "@/lib/data/provider";
import { formatCurrency } from "@/lib/currency";

export function OutcomeChart() {
  const { items, profile } = usePantry();

  const data = useMemo(() => {
    const consumed = items.filter((i) => i.status === "consumed").length;
    const wasted = items.filter((i) => i.status === "wasted" || i.status === "expired").length;
    const donated = items.filter((i) => i.status === "donated").length;
    const available = items.filter((i) => i.status === "available").length;

    const total = consumed + wasted + donated + available;
    if (total === 0) {
      return [
        { name: "Available", value: 1, color: "#d9e2dc", formatted: "No items" },
      ];
    }

    return [
      { name: "Consumed", value: consumed, color: "#168b5b", formatted: `${consumed} items` },
      { name: "Wasted", value: wasted, color: "#dc4c4c", formatted: `${wasted} items` },
      { name: "Donated", value: donated, color: "#7c5ce7", formatted: `${donated} items` },
      { name: "Available", value: available, color: "#22a6b3", formatted: `${available} items` },
    ].filter((d) => d.value > 0);
  }, [items]);

  const totalResolved = items.filter((i) => i.status === "consumed" || i.status === "wasted" || i.status === "expired").length;
  const totalConsumed = items.filter((i) => i.status === "consumed").length;
  const efficiencyRate = totalResolved > 0 ? Math.round((totalConsumed / totalResolved) * 100) : 100;

  return (
    <div className="chart-with-legend">
      <div className="donut-wrap">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(val: number) => [`${val} items`, "Quantity"]} />
          </PieChart>
        </ResponsiveContainer>
        <span className="donut-center">
          <strong>{totalResolved > 0 ? `${efficiencyRate}%` : "—"}</strong>
          <small>efficiency</small>
        </span>
      </div>
      <div className="chart-legend">
        {data.map((entry) => (
          <div key={entry.name}>
            <span style={{ background: entry.color }} />
            <p>{entry.name}</p>
            <strong>{entry.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeeklyWasteChart() {
  const { items, events } = usePantry();

  const data = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayIdx = d.getDay();

      const wasteCount = items.filter((item) => (item.status === "wasted" || item.status === "expired") && item.statusDate === dateStr).length;
      counts[dayIdx] += wasteCount;
    }

    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().slice(0, 10);
      const wasteCount = items.filter((item) => (item.status === "wasted" || item.status === "expired") && item.statusDate === dateStr).length;
      result.push({ day: dayName, waste: wasteCount });
    }
    return result;
  }, [items]);

  return (
    <ResponsiveContainer width="100%" height={210}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eee9" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#748079" }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#748079" }} allowDecimals={false} />
        <Tooltip formatter={(val: number) => [`${val} items wasted`, "Waste"]} />
        <Line type="monotone" dataKey="waste" stroke="#168b5b" strokeWidth={2.4} dot={{ r: 3, fill: "#fff", strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryWasteChart() {
  const { items } = usePantry();

  const data = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
      if (item.status === "wasted" || item.status === "expired") {
        map[item.category] = (map[item.category] || 0) + 1;
      }
    });

    const entries = Object.entries(map).map(([name, value]) => ({ name, value }));
    if (entries.length === 0) {
      return [{ name: "No waste recorded", value: 0 }];
    }
    return entries.sort((a, b) => b.value - a.value);
  }, [items]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 18 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8eee9" />
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#748079" }} allowDecimals={false} />
        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={96} tick={{ fontSize: 12, fill: "#4a554f" }} />
        <Tooltip formatter={(val: number) => [`${val} items`, "Wasted"]} />
        <Bar dataKey="value" fill="#dc4c4c" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MoneySavedVsLostChart() {
  const { items, profile } = usePantry();
  const userCurrency = profile?.currency || "USD";

  const data = useMemo(() => {
    const saved = items.filter((i) => i.status === "consumed").reduce((sum, i) => sum + i.price, 0);
    const lost = items.filter((i) => i.status === "wasted" || i.status === "expired").reduce((sum, i) => sum + i.price, 0);

    return [
      { name: "Saved", amount: saved, fill: "#168b5b" },
      { name: "Lost", amount: lost, fill: "#dc4c4c" },
    ];
  }, [items]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eee9" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: "#4a554f" }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#748079" }} />
        <Tooltip formatter={(val: number) => [formatCurrency(val, userCurrency), "Amount"]} />
        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
