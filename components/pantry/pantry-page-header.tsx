"use client";

import Link from "next/link";
import { CirclePlus } from "lucide-react";

interface PantryPageHeaderProps {
  count: number;
  isDemo?: boolean;
  onDemoAdd?: () => void;
}

export function PantryPageHeader({ count, isDemo = false, onDemoAdd }: PantryPageHeaderProps) {
  const subtitleText = `${count} product${count === 1 ? "" : "s"} currently stored in your household.`;
  const buttonLabel = isDemo ? "Add Demo Item" : "Add Grocery";

  return (
    <section className="page-heading-row pantry-header-row">
      <div className="pantry-header-copy">
        <p className="eyebrow">{isDemo ? "DEMO INVENTORY" : "INVENTORY"}</p>
        <h1>{isDemo ? "Sample Pantry" : "My Pantry"}</h1>
        <p className="pantry-subtitle">{subtitleText}</p>
      </div>

      {isDemo && onDemoAdd ? (
        <button
          type="button"
          onClick={onDemoAdd}
          className="button button-primary pantry-add-button"
          aria-label="Add grocery item"
        >
          <CirclePlus size={20} aria-hidden="true" />
          <span>{buttonLabel}</span>
        </button>
      ) : (
        <Link
          href="/add-item"
          className="button button-primary pantry-add-button"
          aria-label="Add grocery item"
        >
          <CirclePlus size={20} aria-hidden="true" />
          <span>{buttonLabel}</span>
        </Link>
      )}
    </section>
  );
}
