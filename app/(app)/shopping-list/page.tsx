"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CirclePlus, PackagePlus, ShoppingBasket, Trash2, TriangleAlert } from "lucide-react";
import { UNITS } from "@/lib/constants";
import { usePantry } from "@/lib/data/provider";
import { EmptyState } from "@/components/ui/empty-state";

export default function ShoppingListPage() {
  const { items, shoppingItems, addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearShoppingData } = usePantry();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("Piece");
  const [error, setError] = useState("");

  const remaining = shoppingItems.filter((item) => !item.completed).length;
  const completedCount = shoppingItems.filter((item) => item.completed).length;

  const duplicatesMap = useMemo(
    () => new Map(items.filter((item) => item.status === "available").map((item) => [item.productName.toLowerCase(), item])),
    [items]
  );

  async function add(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Enter a valid product name (at least 2 characters).");
      return;
    }
    setError("");

    const duplicateInPantry = duplicatesMap.get(name.trim().toLowerCase());
    if (duplicateInPantry) {
      const confirmAdd = window.confirm(
        `You already have ${duplicateInPantry.quantity} ${duplicateInPantry.unit} of "${duplicateInPantry.productName}" in your pantry. Do you still want to add it to your shopping list?`
      );
      if (!confirmAdd) return;
    }

    try {
      await addShoppingItem(name, quantity, unit);
      setName("");
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add shopping item.");
    }
  }

  async function handleClearCompleted() {
    const completedItems = shoppingItems.filter((i) => i.completed);
    for (const item of completedItems) {
      await deleteShoppingItem(item.id);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading-row">
        <div>
          <p className="eyebrow">Plan before buying</p>
          <h1>Shopping List</h1>
          <p>{remaining} item{remaining === 1 ? "" : "s"} remaining on your list.</p>
        </div>
        {completedCount > 0 && (
          <button className="button button-soft button-small" onClick={handleClearCompleted}>
            Clear {completedCount} completed item{completedCount === 1 ? "" : "s"}
          </button>
        )}
      </section>

      <form className="shopping-add" onSubmit={add}>
        <label className="field">
          <span>Product</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a grocery product…" />
        </label>
        <label className="field compact">
          <span>Quantity</span>
          <input type="number" min="0.01" step="0.01" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </label>
        <label className="field compact">
          <span>Unit</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            {UNITS.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <button className="button button-primary">
          <CirclePlus size={18} /> Add
        </button>
        {error && <p className="form-message error full">{error}</p>}
      </form>

      {shoppingItems.length > 0 ? (
        <section className="shopping-list">
          {shoppingItems.map((entry) => {
            const duplicate = duplicatesMap.get(entry.productName.toLowerCase());
            return (
              <article key={entry.id} className={`shopping-row ${entry.completed ? "completed" : ""}`}>
                <label className="shopping-check">
                  <input type="checkbox" checked={entry.completed} onChange={() => toggleShoppingItem(entry.id)} />
                  <span />
                </label>
                <div className="shopping-copy">
                  <strong>{entry.productName}</strong>
                  <span>{entry.quantity} {entry.unit}</span>
                  {duplicate && (
                    <small style={{ color: "#b45309", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.2rem" }}>
                      <TriangleAlert size={14} /> You already have {duplicate.quantity} {duplicate.unit} in your pantry.
                    </small>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {entry.completed && (
                    <Link
                      href={`/add-item?productName=${encodeURIComponent(entry.productName)}&quantity=${entry.quantity}&unit=${encodeURIComponent(entry.unit)}`}
                      className="button button-ghost button-small"
                      title="Move purchased item to pantry"
                    >
                      <PackagePlus size={16} /> Move to Pantry
                    </Link>
                  )}
                  <button className="icon-button danger" onClick={() => deleteShoppingItem(entry.id)} aria-label={`Delete ${entry.productName}`}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <EmptyState icon={ShoppingBasket} title="Your shopping list is empty" description="Add groceries to buy or move items from your recommendations." />
      )}
    </div>
  );
}
