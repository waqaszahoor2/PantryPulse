"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CirclePlus, Grid2X2, List, PackageSearch, Search } from "lucide-react";
import { CATEGORIES, STORAGE_LOCATIONS } from "@/lib/constants";
import { usePantry } from "@/lib/data/provider";
import type { PantryItem, PantryStatus } from "@/lib/types";
import { ProductCard } from "@/components/pantry/product-card";
import { ItemEditor } from "@/components/pantry/item-editor";
import { EmptyState } from "@/components/ui/empty-state";
import { calculateRisk } from "@/lib/risk";

export default function PantryPage() {
  const { items, updateItem, deleteItem, markStatus } = usePantry();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [storage, setStorage] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"expiry" | "name" | "price">("expiry");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [editing, setEditing] = useState<PantryItem | null>(null);

  const available = items.filter((item) => item.status === "available");

  const filtered = useMemo(() => {
    return available
      .filter((item) => {
        if (category !== "All" && item.category !== category) return false;
        if (storage !== "All" && item.storageLocation !== storage) return false;
        if (query.trim() && !item.productName.toLowerCase().includes(query.toLowerCase())) return false;
        if (riskFilter !== "All") {
          const r = calculateRisk(item);
          if (r.level !== riskFilter.toLowerCase()) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "expiry") return a.expiryDate.localeCompare(b.expiryDate);
        if (sortBy === "name") return a.productName.localeCompare(b.productName);
        if (sortBy === "price") return b.price - a.price;
        return 0;
      });
  }, [available, category, storage, query, riskFilter, sortBy]);

  async function confirmDelete(item: PantryItem) {
    if (window.confirm(`Delete ${item.productName}? This will permanently remove it from your pantry records.`)) {
      await deleteItem(item.id);
    }
  }

  async function handleStatusChange(id: string, status: PantryStatus) {
    let wasteReason: string | undefined = undefined;
    if (status === "wasted") {
      const reason = window.prompt("Optionally enter a waste reason (e.g. Forgotten, Expired, Spoiled):");
      if (reason !== null) wasteReason = reason;
    }
    await markStatus(id, status, wasteReason);
  }

  return (
    <div className="page-stack">
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>My Pantry</h1>
          <p>{available.length} product{available.length === 1 ? "" : "s"} currently stored in your household.</p>
        </div>
        <Link className="button button-primary" href="/add-item">
          <CirclePlus size={18} /> Add grocery
        </Link>
      </section>

      <section className="filter-panel">
        <label className="filter-search">
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products by name…" />
        </label>

        <select aria-label="Category filter" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>

        <select aria-label="Storage filter" value={storage} onChange={(e) => setStorage(e.target.value)}>
          <option value="All">All Storage Locations</option>
          {STORAGE_LOCATIONS.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>

        <select aria-label="Risk filter" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
          <option value="All">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
          <option value="expired">Expired</option>
        </select>

        <select aria-label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value as "expiry" | "name" | "price")}>
          <option value="expiry">Sort by Expiry Date</option>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>

        <div className="view-toggle">
          <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Grid view">
            <Grid2X2 size={17} />
          </button>
          <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="List view">
            <List size={17} />
          </button>
        </div>
      </section>

      {filtered.length > 0 ? (
        <section className={view === "grid" ? "product-grid" : "product-list-view"}>
          {filtered.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              similarCount={available.filter((other) => other.id !== item.id && other.productName.toLowerCase() === item.productName.toLowerCase()).length}
              onEdit={setEditing}
              onDelete={confirmDelete}
              onStatus={handleStatusChange}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={PackageSearch}
          title="No matching groceries"
          description="Try adjusting your search terms or filters, or add a new item."
          action="Add grocery"
          href="/add-item"
        />
      )}

      <ItemEditor item={editing} onClose={() => setEditing(null)} onSave={updateItem} />
    </div>
  );
}
