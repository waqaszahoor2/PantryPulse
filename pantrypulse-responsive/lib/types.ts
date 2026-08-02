export type PantryStatus = "available" | "consumed" | "wasted" | "donated" | "expired";
export type RiskLevel = "low" | "medium" | "high" | "expired";
export type StorageLocation = "Pantry" | "Refrigerator" | "Freezer" | "Kitchen counter" | "Other";

export interface PantryItem {
  id: string;
  userId?: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  purchaseDate: string;
  expiryDate: string;
  storageLocation: StorageLocation;
  opened: boolean;
  notes?: string;
  status: PantryStatus;
  statusDate?: string;
  wasteReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  userId?: string;
  productName: string;
  quantity: number;
  unit: string;
  completed: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: "urgent" | "warning" | "info" | "success";
  itemId?: string;
  read: boolean;
  createdAt: string;
}

export interface PantryItemInput {
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  purchaseDate: string;
  expiryDate: string;
  storageLocation: StorageLocation;
  opened: boolean;
  notes?: string;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  daysRemaining: number;
  reasons: string[];
  action: string;
}
