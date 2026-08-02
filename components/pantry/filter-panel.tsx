"use client";

import { Grid2X2, List, RotateCcw, Search } from "lucide-react";
import { CATEGORIES, STORAGE_LOCATIONS } from "@/lib/constants";

interface FilterPanelProps {
  query: string;
  onQueryChange: (q: string) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  storage: string;
  onStorageChange: (s: string) => void;
  riskFilter: string;
  onRiskFilterChange: (r: string) => void;
  sortBy: "expiry" | "name" | "price";
  onSortByChange: (s: "expiry" | "name" | "price") => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  onResetFilters: () => void;
}

export function FilterPanel({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  storage,
  onStorageChange,
  riskFilter,
  onRiskFilterChange,
  sortBy,
  onSortByChange,
  view,
  onViewChange,
  onResetFilters,
}: FilterPanelProps) {
  const isFiltered = query.trim() !== "" || category !== "All" || storage !== "All" || riskFilter !== "All" || sortBy !== "expiry";

  return (
    <section className="filter-panel" style={{ padding: "1rem", borderRadius: "16px", background: "var(--surface)", border: "1px solid var(--line)" }}>
      <label className="filter-search" style={{ minHeight: "44px" }}>
        <Search size={18} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search products by name…"
          aria-label="Search products"
        />
      </label>

      <select
        aria-label="Category filter"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        style={{ minHeight: "44px" }}
      >
        <option value="All">All Categories</option>
        {CATEGORIES.map((val) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>

      <select
        aria-label="Storage filter"
        value={storage}
        onChange={(e) => onStorageChange(e.target.value)}
        style={{ minHeight: "44px" }}
      >
        <option value="All">All Storage Locations</option>
        {STORAGE_LOCATIONS.map((val) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>

      <select
        aria-label="Risk filter"
        value={riskFilter}
        onChange={(e) => onRiskFilterChange(e.target.value)}
        style={{ minHeight: "44px" }}
      >
        <option value="All">All Risk Levels</option>
        <option value="high">High Risk</option>
        <option value="medium">Medium Risk</option>
        <option value="low">Low Risk</option>
        <option value="expired">Expired</option>
      </select>

      <select
        aria-label="Sort by"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as "expiry" | "name" | "price")}
        style={{ minHeight: "44px" }}
      >
        <option value="expiry">Sort by Expiry Date</option>
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
      </select>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <div className="view-toggle" style={{ height: "44px" }}>
          <button
            type="button"
            className={view === "grid" ? "active" : ""}
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
          >
            <Grid2X2 size={18} />
          </button>
          <button
            type="button"
            className={view === "list" ? "active" : ""}
            onClick={() => onViewChange("list")}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="button button-ghost button-small"
            style={{ height: "44px", minWidth: "44px", padding: "0 0.75rem" }}
            aria-label="Reset filters"
            title="Reset filters"
          >
            <RotateCcw size={16} /> Reset
          </button>
        )}
      </div>
    </section>
  );
}
