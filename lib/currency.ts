export type SupportedCurrency = "PKR" | "USD" | "GBP" | "EUR" | "CAD" | "AUD" | "INR";

const CURRENCY_LOCALE_MAP: Record<SupportedCurrency, string> = {
  PKR: "en-PK",
  USD: "en-US",
  GBP: "en-GB",
  EUR: "de-DE",
  CAD: "en-CA",
  AUD: "en-AU",
  INR: "en-IN",
};

/**
 * Standardized currency formatter using Intl.NumberFormat.
 * Supports PKR, USD, GBP, EUR, CAD, AUD, and INR gracefully.
 * Defaults to PKR if currency is missing or unsupported.
 */
export function formatCurrency(amount: number | null | undefined, currencyCode: string = "PKR"): string {
  const value = typeof amount === "number" && !isNaN(amount) ? amount : 0;
  const upperCode = (currencyCode || "PKR").toUpperCase();
  const safeCurrency: SupportedCurrency = upperCode in CURRENCY_LOCALE_MAP
    ? (upperCode as SupportedCurrency)
    : "PKR";

  const locale = CURRENCY_LOCALE_MAP[safeCurrency] || "en-PK";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: safeCurrency === "PKR" || safeCurrency === "INR" ? 0 : 2,
    }).format(value);
  } catch {
    return `${safeCurrency} ${value.toFixed(2)}`;
  }
}
