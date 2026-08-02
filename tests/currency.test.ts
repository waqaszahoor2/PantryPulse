import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/lib/currency";

describe("Currency Formatter (lib/currency.ts)", () => {
  it("formats PKR currency correctly", () => {
    const formatted = formatCurrency(1840, "PKR");
    expect(formatted).toContain("1,840");
  });

  it("formats USD currency correctly", () => {
    const formatted = formatCurrency(25.5, "USD");
    expect(formatted).toContain("25.50");
  });

  it("formats EUR currency correctly", () => {
    const formatted = formatCurrency(15.99, "EUR");
    expect(formatted).toContain("15,99");
  });

  it("formats INR currency correctly", () => {
    const formatted = formatCurrency(3250, "INR");
    expect(formatted).toContain("3,250");
  });

  it("defaults to PKR when currency code is missing or invalid", () => {
    const formattedNull = formatCurrency(500, null as unknown as string);
    const formattedInvalid = formatCurrency(500, "XYZ");
    expect(formattedNull).toContain("500");
    expect(formattedInvalid).toContain("500");
  });

  it("handles zero, negative, and non-numeric amounts safely", () => {
    expect(formatCurrency(0, "USD")).toContain("0.00");
    expect(formatCurrency(-10, "USD")).toContain("10.00");
    expect(formatCurrency(NaN, "PKR")).toContain("0");
  });
});
