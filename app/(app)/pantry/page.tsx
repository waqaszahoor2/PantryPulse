"use client";

import { useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";
import { usePantry } from "@/lib/data/provider";
import type { PantryItem, PantryStatus } from "@/lib/types";
import { ProductCard } from "@/components/pantry/product-card";
import { ItemEditor } from "@/components/pantry/item-editor";
import { EmptyState } from "@/components/ui/empty-state";
import { calculateRisk } from "@/lib/risk";
import { PantryPageHeader } from "@/components/pantry/pantry-page-header";
import { FilterPanel } from "@/components/pantry/filter-panel";
import { AppPageContainer } from "@/components/layout/containers";

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

  function resetFilters() {
    setQuery("");
    setCategory("All");
    setStorage("All");
    setRiskFilter("All");
    setSortBy("expiry");
  }

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
    <AppPageContainer className="page-stack">
      <PantryPageHeader count={available.length} />

      <FilterPanel
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        storage={storage}
        onStorageChange={setStorage}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        view={view}
        onViewChange={setView}
        onResetFilters={resetFilters}
      />

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
          description="Try adjusting your search terms or filters, or add a new grocery item to your pantry."
          action="Add grocery"
          href="/add-item"
        />
      )}

      <ItemEditor item={editing} onClose={() => setEditing(null)} onSave={updateItem} />
    </AppPageContainer>
  );
}
