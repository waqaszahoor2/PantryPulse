"use client";

import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts";

const outcomeData = [
  { name: "Consumed", value: 78, color: "#168b5b" },
  { name: "Wasted", value: 12, color: "#dc4c4c" },
  { name: "Donated", value: 6, color: "#7c5ce7" },
  { name: "Other", value: 4, color: "#d9e2dc" },
];

const weeklyData = [
  { day: "Mon", waste: 2 }, { day: "Tue", waste: 7 }, { day: "Wed", waste: 3 }, { day: "Thu", waste: 6 }, { day: "Fri", waste: 2 }, { day: "Sat", waste: 5 }, { day: "Sun", waste: 9 },
];

export function OutcomeChart() {
  return <div className="chart-with-legend"><div className="donut-wrap"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={outcomeData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2}>{outcomeData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><span className="donut-center"><strong>82%</strong><small>efficiency</small></span></div><div className="chart-legend">{outcomeData.map((entry) => <div key={entry.name}><span style={{ background: entry.color }} /><p>{entry.name}</p><strong>{entry.value}%</strong></div>)}</div></div>;
}

export function WeeklyWasteChart() {
  return <ResponsiveContainer width="100%" height={210}><LineChart data={weeklyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eee9" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#748079" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#748079" }} /><Tooltip /><Line type="monotone" dataKey="waste" stroke="#168b5b" strokeWidth={2.4} dot={{ r: 3, fill: "#fff", strokeWidth: 2 }} /></LineChart></ResponsiveContainer>;
}

export function CategoryWasteChart() {
  const data = [{ name: "Vegetables", value: 34 }, { name: "Dairy", value: 28 }, { name: "Bread", value: 18 }, { name: "Fruit", value: 12 }, { name: "Other", value: 8 }];
  return <ResponsiveContainer width="100%" height={250}><BarChart data={data} layout="vertical" margin={{ left: 4, right: 18 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e8eee9" /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#748079" }} /><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={82} tick={{ fontSize: 12, fill: "#4a554f" }} /><Tooltip /><Bar dataKey="value" fill="#168b5b" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer>;
}
