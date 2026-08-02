"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { sampleNotifications, samplePantryItems, sampleShoppingItems } from "@/lib/data/mock";
import type { AppNotification, PantryItem, PantryItemInput, PantryStatus, ShoppingItem } from "@/lib/types";

interface PantryContextValue {
  items: PantryItem[];
  shoppingItems: ShoppingItem[];
  notifications: AppNotification[];
  loading: boolean;
  mode: "demo" | "supabase";
  addItem(input: PantryItemInput): Promise<void>;
  updateItem(id: string, patch: Partial<PantryItem>): Promise<void>;
  deleteItem(id: string): Promise<void>;
  markStatus(id: string, status: PantryStatus, wasteReason?: string): Promise<void>;
  addShoppingItem(productName: string, quantity: number, unit: string): Promise<void>;
  toggleShoppingItem(id: string): Promise<void>;
  deleteShoppingItem(id: string): Promise<void>;
  markNotificationRead(id: string): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
  resetDemoData(): void;
  clearLocalData(): void;
}

const PantryContext = createContext<PantryContextValue | null>(null);
const KEYS = { items: "pantrypulse.items", shopping: "pantrypulse.shopping", notifications: "pantrypulse.notifications" };

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function mapPantryRow(row: Record<string, unknown>): PantryItem {
  return {
    id: String(row.id),
    userId: String(row.user_id ?? ""),
    productName: String(row.product_name),
    category: String(row.category),
    quantity: Number(row.quantity),
    unit: String(row.unit),
    price: Number(row.price ?? 0),
    purchaseDate: String(row.purchase_date),
    expiryDate: String(row.expiry_date),
    storageLocation: row.storage_location as PantryItem["storageLocation"],
    opened: Boolean(row.opened),
    notes: row.notes ? String(row.notes) : undefined,
    status: row.status as PantryStatus,
    statusDate: row.status_date ? String(row.status_date) : undefined,
    wasteReason: row.waste_reason ? String(row.waste_reason) : undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function pantryToRow(input: PantryItemInput) {
  return {
    product_name: input.productName.trim(),
    category: input.category,
    quantity: input.quantity,
    unit: input.unit,
    price: input.price,
    purchase_date: input.purchaseDate,
    expiry_date: input.expiryDate,
    storage_location: input.storageLocation,
    opened: input.opened,
    notes: input.notes?.trim() || null,
    status: "available",
  };
}

export function PantryProvider({ children }: { children: ReactNode }) {
  const requestedMode = process.env.NEXT_PUBLIC_DATA_MODE === "supabase" ? "supabase" : "demo";
  const mode = (requestedMode === "supabase" && isSupabaseConfigured() ? "supabase" : "demo") as "supabase" | "demo";
  const [items, setItems] = useState<PantryItem[]>(samplePantryItems);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(sampleShoppingItems);
  const [notifications, setNotifications] = useState<AppNotification[]>(sampleNotifications);
  const [loading, setLoading] = useState(true);

  const persist = useCallback((nextItems: PantryItem[], nextShopping: ShoppingItem[], nextNotifications: AppNotification[]) => {
    if (mode !== "demo" || typeof window === "undefined") return;
    localStorage.setItem(KEYS.items, JSON.stringify(nextItems));
    localStorage.setItem(KEYS.shopping, JSON.stringify(nextShopping));
    localStorage.setItem(KEYS.notifications, JSON.stringify(nextNotifications));
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (mode === "demo") {
        if (!cancelled) {
          setItems(safeRead(KEYS.items, samplePantryItems));
          setShoppingItems(safeRead(KEYS.shopping, sampleShoppingItems));
          setNotifications(safeRead(KEYS.notifications, sampleNotifications));
          setLoading(false);
        }
        return;
      }

      const supabase = createClient();
      const [{ data: pantry, error: pantryError }, { data: shopping, error: shoppingError }, { data: notes, error: notesError }] = await Promise.all([
        supabase.from("pantry_items").select("*").order("expiry_date"),
        supabase.from("shopping_list").select("*").order("created_at", { ascending: false }),
        supabase.from("app_notifications").select("*").order("created_at", { ascending: false }),
      ]);
      if (pantryError || shoppingError || notesError) console.error("Supabase load error", pantryError ?? shoppingError ?? notesError);
      if (!cancelled) {
        if (pantry) setItems(pantry.map((row) => mapPantryRow(row)));
        if (shopping) setShoppingItems(shopping.map((row) => ({ id: String(row.id), userId: String(row.user_id), productName: String(row.product_name), quantity: Number(row.quantity), unit: String(row.unit), completed: Boolean(row.completed), createdAt: String(row.created_at) })));
        if (notes) setNotifications(notes.map((row) => ({ id: String(row.id), userId: String(row.user_id), title: String(row.title), message: String(row.message), type: row.type as AppNotification["type"], itemId: row.item_id ? String(row.item_id) : undefined, read: Boolean(row.is_read), createdAt: String(row.created_at) })));
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [mode]);

  useEffect(() => { persist(items, shoppingItems, notifications); }, [items, shoppingItems, notifications, persist]);

  const addItem = useCallback(async (input: PantryItemInput) => {
    if (mode === "supabase") {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in again.");
      const { data, error } = await supabase.from("pantry_items").insert({ ...pantryToRow(input), user_id: user.id }).select().single();
      if (error) throw error;
      setItems((current) => [mapPantryRow(data), ...current]);
      return;
    }
    const stamp = new Date().toISOString();
    setItems((current) => [{ id: crypto.randomUUID(), ...input, status: "available", createdAt: stamp, updatedAt: stamp }, ...current]);
  }, [mode]);

  const updateItem = useCallback(async (id: string, patch: Partial<PantryItem>) => {
    if (mode === "supabase") {
      const row: Record<string, unknown> = {};
      if (patch.productName !== undefined) row.product_name = patch.productName.trim();
      if (patch.category !== undefined) row.category = patch.category;
      if (patch.quantity !== undefined) row.quantity = patch.quantity;
      if (patch.unit !== undefined) row.unit = patch.unit;
      if (patch.price !== undefined) row.price = patch.price;
      if (patch.purchaseDate !== undefined) row.purchase_date = patch.purchaseDate;
      if (patch.expiryDate !== undefined) row.expiry_date = patch.expiryDate;
      if (patch.storageLocation !== undefined) row.storage_location = patch.storageLocation;
      if (patch.opened !== undefined) row.opened = patch.opened;
      if (patch.notes !== undefined) row.notes = patch.notes || null;
      if (patch.status !== undefined) row.status = patch.status;
      if (patch.statusDate !== undefined) row.status_date = patch.statusDate;
      if (patch.wasteReason !== undefined) row.waste_reason = patch.wasteReason || null;
      const supabase = createClient();
      const { data, error } = await supabase.from("pantry_items").update(row).eq("id", id).select().single();
      if (error) throw error;
      setItems((current) => current.map((item) => item.id === id ? mapPantryRow(data) : item));
      return;
    }
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));
  }, [mode]);

  const deleteItem = useCallback(async (id: string) => {
    if (mode === "supabase") {
      const { error } = await createClient().from("pantry_items").delete().eq("id", id);
      if (error) throw error;
    }
    setItems((current) => current.filter((item) => item.id !== id));
  }, [mode]);

  const markStatus = useCallback(async (id: string, status: PantryStatus, wasteReason?: string) => {
    await updateItem(id, { status, statusDate: new Date().toISOString().slice(0, 10), wasteReason });
  }, [updateItem]);

  const addShoppingItem = useCallback(async (productName: string, quantity: number, unit: string) => {
    if (mode === "supabase") {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in again.");
      const { data, error } = await supabase.from("shopping_list").insert({ user_id: user.id, product_name: productName.trim(), quantity, unit }).select().single();
      if (error) throw error;
      setShoppingItems((current) => [{ id: String(data.id), userId: String(data.user_id), productName: String(data.product_name), quantity: Number(data.quantity), unit: String(data.unit), completed: Boolean(data.completed), createdAt: String(data.created_at) }, ...current]);
      return;
    }
    setShoppingItems((current) => [{ id: crypto.randomUUID(), productName: productName.trim(), quantity, unit, completed: false, createdAt: new Date().toISOString() }, ...current]);
  }, [mode]);

  const toggleShoppingItem = useCallback(async (id: string) => {
    const current = shoppingItems.find((item) => item.id === id);
    if (!current) return;
    const completed = !current.completed;
    if (mode === "supabase") {
      const { error } = await createClient().from("shopping_list").update({ completed }).eq("id", id);
      if (error) throw error;
    }
    setShoppingItems((all) => all.map((item) => item.id === id ? { ...item, completed } : item));
  }, [mode, shoppingItems]);

  const deleteShoppingItem = useCallback(async (id: string) => {
    if (mode === "supabase") {
      const { error } = await createClient().from("shopping_list").delete().eq("id", id);
      if (error) throw error;
    }
    setShoppingItems((current) => current.filter((item) => item.id !== id));
  }, [mode]);

  const markNotificationRead = useCallback(async (id: string) => {
    if (mode === "supabase") {
      const { error } = await createClient().from("app_notifications").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    }
    setNotifications((current) => current.map((note) => note.id === id ? { ...note, read: true } : note));
  }, [mode]);

  const markAllNotificationsRead = useCallback(async () => {
    if (mode === "supabase") {
      const { error } = await createClient().from("app_notifications").update({ is_read: true }).eq("is_read", false);
      if (error) throw error;
    }
    setNotifications((current) => current.map((note) => ({ ...note, read: true })));
  }, [mode]);

  const resetDemoData = useCallback(() => {
    setItems(samplePantryItems); setShoppingItems(sampleShoppingItems); setNotifications(sampleNotifications);
  }, []);

  const clearLocalData = useCallback(() => {
    setItems([]); setShoppingItems([]); setNotifications([]);
    if (typeof window !== "undefined") Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  }, []);

  const value = useMemo(() => ({ items, shoppingItems, notifications, loading, mode, addItem, updateItem, deleteItem, markStatus, addShoppingItem, toggleShoppingItem, deleteShoppingItem, markNotificationRead, markAllNotificationsRead, resetDemoData, clearLocalData }), [items, shoppingItems, notifications, loading, mode, addItem, updateItem, deleteItem, markStatus, addShoppingItem, toggleShoppingItem, deleteShoppingItem, markNotificationRead, markAllNotificationsRead, resetDemoData, clearLocalData]);
  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry() {
  const context = useContext(PantryContext);
  if (!context) throw new Error("usePantry must be used inside PantryProvider.");
  return context;
}
