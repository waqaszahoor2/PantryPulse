export const CATEGORIES = [
  "Dairy",
  "Vegetables",
  "Fruits",
  "Meat",
  "Bread & Bakery",
  "Frozen food",
  "Beverages",
  "Pantry items",
  "Other",
] as const;

export const UNITS = ["Piece", "Pack", "Bottle", "Can", "Kilogram", "Gram", "Litre", "Millilitre"] as const;

export const STORAGE_LOCATIONS = ["Pantry", "Refrigerator", "Freezer", "Kitchen counter", "Other"] as const;

export const PRODUCT_EMOJI: Record<string, string> = {
  Dairy: "🥛",
  Vegetables: "🍅",
  Fruits: "🍎",
  Meat: "🍗",
  "Bread & Bakery": "🍞",
  "Frozen food": "❄️",
  Beverages: "🧃",
  "Pantry items": "🥫",
  Other: "🛒",
};
