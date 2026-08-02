import type { PantryItem, RiskResult } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

export { formatCurrency };

const DAY_MS = 86_400_000;

export function startOfLocalDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function daysUntil(dateString: string, now = new Date()): number {
  if (!dateString) return 0;
  const target = startOfLocalDay(new Date(`${dateString}T00:00:00`));
  const today = startOfLocalDay(now);
  return Math.ceil((target.getTime() - today.getTime()) / DAY_MS);
}

export function calculateRisk(item: PantryItem, similarAvailableCount = 0): RiskResult {
  const daysRemaining = daysUntil(item.expiryDate);
  const reasons: string[] = [];

  if (daysRemaining < 0) {
    return {
      score: 100,
      level: "expired",
      daysRemaining,
      reasons: ["The recorded expiry date has passed."],
      action: "Review package label, storage duration, and official guidance. Discard if quality, odor, texture, or packaging is questionable.",
    };
  }

  let score = 0;
  if (daysRemaining === 0) {
    score += 60;
    reasons.push("The item expires today.");
  } else if (daysRemaining === 1) {
    score += 48;
    reasons.push("The item expires tomorrow.");
  } else if (daysRemaining <= 3) {
    score += 36;
    reasons.push(`Only ${daysRemaining} days remain until expiry.`);
  } else if (daysRemaining <= 7) {
    score += 20;
    reasons.push("The item expires within one week.");
  }

  if (item.opened) {
    score += 15;
    reasons.push("The package is open.");
  }

  if (item.quantity >= 3) {
    score += 12;
    reasons.push("The recorded quantity is high.");
  }

  if (similarAvailableCount > 0) {
    score += Math.min(18, similarAvailableCount * 8);
    reasons.push(`${similarAvailableCount} similar item${similarAvailableCount > 1 ? "s are" : " is"} already in your pantry.`);
  }

  if (["Dairy", "Vegetables", "Fruits", "Meat", "Bread & Bakery"].includes(item.category)) {
    score += 8;
    reasons.push("Perishable category.");
  }

  score = Math.min(100, Math.max(0, score));
  const level = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
  const action = level === "high"
    ? "High planning priority: Plan to consume, freeze, or donate this item soon."
    : level === "medium"
      ? "Expiry attention: Keep visible and plan to use this week."
      : "No immediate planning action required.";

  if (reasons.length === 0) reasons.push("Sufficient shelf life remaining.");
  return { score, level, daysRemaining, reasons, action };
}

export function expiryLabel(daysRemaining: number): string {
  if (daysRemaining < 0) return `Expired ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) === 1 ? "" : "s"} ago`;
  if (daysRemaining === 0) return "Expires today";
  if (daysRemaining === 1) return "Expires tomorrow";
  return `Expires in ${daysRemaining} days`;
}
