import { describe, expect, it } from "vitest";
import { calculateRisk, daysUntil } from "@/lib/risk";
import type { PantryItem } from "@/lib/types";

const base: PantryItem = {
  id: "1", productName: "Milk", category: "Dairy", quantity: 1, unit: "Litre", price: 300,
  purchaseDate: "2026-08-01", expiryDate: "2026-08-03", storageLocation: "Refrigerator",
  opened: false, status: "available", createdAt: "2026-08-01T00:00:00Z", updatedAt: "2026-08-01T00:00:00Z",
};

describe("risk engine", () => {
  it("calculates remaining calendar days", () => {
    expect(daysUntil("2026-08-03", new Date("2026-08-02T12:00:00"))).toBe(1);
  });
  it("marks an opened perishable item expiring tomorrow as high risk", () => {
    const result = calculateRisk({ ...base, opened: true }, 1);
    expect(result.level).toBe("high");
    expect(result.score).toBeGreaterThanOrEqual(70);
  });
});
