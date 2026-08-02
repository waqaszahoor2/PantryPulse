"use client";

import { Check, Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { PRODUCT_EMOJI } from "@/lib/constants";
import { calculateRisk, expiryLabel } from "@/lib/risk";
import type { PantryItem, PantryStatus } from "@/lib/types";
import { RiskBadge } from "@/components/ui/risk-badge";

export function ProductCard({ item, similarCount = 0, onEdit, onDelete, onStatus }: { item: PantryItem; similarCount?: number; onEdit?: (item: PantryItem) => void; onDelete?: (item: PantryItem) => void; onStatus?: (id: string, status: PantryStatus) => void }) {
  const risk = calculateRisk(item, similarCount);
  return (
    <article className="product-card">
      <div className="product-card-top">
        <span className="product-visual" aria-hidden="true">{PRODUCT_EMOJI[item.category] ?? "🛒"}</span>
        <button className="icon-button subtle" aria-label={`More options for ${item.productName}`}><MoreHorizontal size={18} /></button>
      </div>
      <div className="product-card-body">
        <p className="eyebrow">{item.category}</p>
        <h3>{item.productName}</h3>
        <p className="muted">{item.quantity} {item.unit} · {item.storageLocation}</p>
        <div className="product-meta">
          <span>{expiryLabel(risk.daysRemaining)}</span>
          <RiskBadge level={risk.level} />
        </div>
      </div>
      <div className="product-actions">
        {item.status === "available" && <button className="button button-soft button-small" onClick={() => onStatus?.(item.id, "consumed")}><Check size={15} /> Consumed</button>}
        <button className="icon-button" aria-label={`Edit ${item.productName}`} onClick={() => onEdit?.(item)}><Edit3 size={16} /></button>
        <button className="icon-button danger" aria-label={`Delete ${item.productName}`} onClick={() => onDelete?.(item)}><Trash2 size={16} /></button>
      </div>
    </article>
  );
}
