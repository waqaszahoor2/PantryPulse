import type { AppNotification, PantryItem, ShoppingItem } from "@/lib/types";

function isoDate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

const now = new Date().toISOString();

export const samplePantryItems: PantryItem[] = [
  { id: "milk", productName: "Milk", category: "Dairy", quantity: 2, unit: "Litre", price: 520, purchaseDate: isoDate(-2), expiryDate: isoDate(1), storageLocation: "Refrigerator", opened: true, status: "available", createdAt: now, updatedAt: now },
  { id: "tomatoes", productName: "Tomatoes", category: "Vegetables", quantity: 1, unit: "Kilogram", price: 260, purchaseDate: isoDate(-3), expiryDate: isoDate(2), storageLocation: "Refrigerator", opened: false, status: "available", createdAt: now, updatedAt: now },
  { id: "bread", productName: "Bread", category: "Bread & Bakery", quantity: 1, unit: "Pack", price: 180, purchaseDate: isoDate(-1), expiryDate: isoDate(3), storageLocation: "Pantry", opened: true, status: "available", createdAt: now, updatedAt: now },
  { id: "chicken", productName: "Chicken", category: "Meat", quantity: 1, unit: "Kilogram", price: 1050, purchaseDate: isoDate(-1), expiryDate: isoDate(5), storageLocation: "Freezer", opened: false, status: "available", createdAt: now, updatedAt: now },
  { id: "apples", productName: "Apples", category: "Fruits", quantity: 6, unit: "Piece", price: 430, purchaseDate: isoDate(-4), expiryDate: isoDate(8), storageLocation: "Refrigerator", opened: false, status: "available", createdAt: now, updatedAt: now },
  { id: "yogurt", productName: "Yogurt", category: "Dairy", quantity: 4, unit: "Pack", price: 360, purchaseDate: isoDate(-2), expiryDate: isoDate(6), storageLocation: "Refrigerator", opened: false, status: "available", createdAt: now, updatedAt: now },
  { id: "rice", productName: "Rice", category: "Pantry items", quantity: 2, unit: "Kilogram", price: 720, purchaseDate: isoDate(-14), expiryDate: isoDate(120), storageLocation: "Pantry", opened: true, status: "available", createdAt: now, updatedAt: now },
  { id: "bananas-old", productName: "Bananas", category: "Fruits", quantity: 4, unit: "Piece", price: 210, purchaseDate: isoDate(-9), expiryDate: isoDate(-1), storageLocation: "Kitchen counter", opened: false, status: "wasted", statusDate: isoDate(-1), wasteReason: "Forgotten", createdAt: now, updatedAt: now },
  { id: "cheese-consumed", productName: "Cheese", category: "Dairy", quantity: 1, unit: "Pack", price: 650, purchaseDate: isoDate(-15), expiryDate: isoDate(-4), storageLocation: "Refrigerator", opened: true, status: "consumed", statusDate: isoDate(-5), createdAt: now, updatedAt: now },
];

export const sampleShoppingItems: ShoppingItem[] = [
  { id: "eggs", productName: "Eggs", quantity: 12, unit: "Piece", completed: false, createdAt: now },
  { id: "oil", productName: "Cooking Oil", quantity: 1, unit: "Bottle", completed: false, createdAt: now },
  { id: "tea", productName: "Tea", quantity: 1, unit: "Pack", completed: false, createdAt: now },
  { id: "milk-shop", productName: "Milk", quantity: 1, unit: "Litre", completed: false, createdAt: now },
];

export const sampleNotifications: AppNotification[] = [
  { id: "n1", title: "Milk expires tomorrow", message: "Use it today or include it in tomorrow's breakfast.", type: "urgent", itemId: "milk", read: false, createdAt: now },
  { id: "n2", title: "Tomatoes need attention", message: "They expire in two days and are currently high risk.", type: "warning", itemId: "tomatoes", read: false, createdAt: now },
  { id: "n3", title: "Good progress", message: "Your demo pantry shows fewer wasted items than consumed items.", type: "success", read: true, createdAt: now },
];
