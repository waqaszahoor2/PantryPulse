"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { sampleNotifications, samplePantryItems, sampleShoppingItems } from "@/lib/data/mock";
import type { AppNotification, InventoryEvent, PantryItem, PantryItemInput, PantryStatus, ShoppingItem, UserProfile } from "@/lib/types";

interface PantryContextValue {
  profile: UserProfile | null;
  items: PantryItem[];
  shoppingItems: ShoppingItem[];
  notifications: AppNotification[];
  events: InventoryEvent[];
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
  deleteNotification(id: string): Promise<void>;
  updateUserProfile(data: Partial<UserProfile>): Promise<void>;
  exportDataAsJSON(): string;
  exportDataAsCSV(): string;
  clearPantryData(): Promise<void>;
  clearEventHistory(): Promise<void>;
  clearShoppingData(): Promise<void>;
  resetDemoData(): void;
  clearLocalData(): void;
}

const PantryContext = createContext<PantryContextValue | null>(null);
const KEYS = {
  items: "pantrypulse.items",
  shopping: "pantrypulse.shopping",
  notifications: "pantrypulse.notifications",
  events: "pantrypulse.events",
  profile: "pantrypulse.profile",
};

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
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

const defaultProfile: UserProfile = {
  id: "demo-user",
  fullName: "Demo User",
  householdSize: 2,
  currency: "PKR",
  country: "PK",
  gender: "Prefer not to say",
  email: "demo@pantrypulse.app",
  avatarUrl: "",
};

export function PantryProvider({ children }: { children: ReactNode }) {
  const requestedMode = process.env.NEXT_PUBLIC_DATA_MODE === "supabase" ? "supabase" : "demo";
  const mode = (requestedMode === "supabase" && isSupabaseConfigured() ? "supabase" : "demo") as "supabase" | "demo";

  const [profile, setProfile] = useState<UserProfile | null>(defaultProfile);
  const [items, setItems] = useState<PantryItem[]>(samplePantryItems);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(sampleShoppingItems);
  const [notifications, setNotifications] = useState<AppNotification[]>(sampleNotifications);
  const [events, setEvents] = useState<InventoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const persist = useCallback((nextItems: PantryItem[], nextShopping: ShoppingItem[], nextNotifications: AppNotification[], nextEvents: InventoryEvent[], nextProfile: UserProfile | null) => {
    if (mode !== "demo" || typeof window === "undefined") return;
    localStorage.setItem(KEYS.items, JSON.stringify(nextItems));
    localStorage.setItem(KEYS.shopping, JSON.stringify(nextShopping));
    localStorage.setItem(KEYS.notifications, JSON.stringify(nextNotifications));
    localStorage.setItem(KEYS.events, JSON.stringify(nextEvents));
    if (nextProfile) localStorage.setItem(KEYS.profile, JSON.stringify(nextProfile));
  }, [mode]);

  const recordEvent = useCallback(async (eventType: string, details: Record<string, unknown>, itemId?: string) => {
    const stamp = new Date().toISOString();
    if (mode === "supabase") {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from("inventory_events").insert({ user_id: user.id, item_id: itemId || null, event_type: eventType, details }).select().single();
          if (data) {
            setEvents((cur) => [{ id: String(data.id), userId: String(data.user_id), itemId: data.item_id ? String(data.item_id) : undefined, eventType: String(data.event_type), details: (data.details as Record<string, unknown>) || {}, createdAt: String(data.created_at) }, ...cur]);
          }
        }
      } catch (err) {
        console.error("Failed to record event in Supabase:", err);
      }
      return;
    }
    setEvents((cur) => [{ id: crypto.randomUUID(), userId: "demo-user", itemId, eventType, details, createdAt: stamp }, ...cur]);
  }, [mode]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (mode === "demo") {
        if (!cancelled) {
          setItems(safeRead(KEYS.items, samplePantryItems));
          setShoppingItems(safeRead(KEYS.shopping, sampleShoppingItems));
          setNotifications(safeRead(KEYS.notifications, sampleNotifications));
          setEvents(safeRead(KEYS.events, []));
          setProfile(safeRead(KEYS.profile, defaultProfile));
          setLoading(false);
        }
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setProfile(null);
          setItems([]);
          setShoppingItems([]);
          setNotifications([]);
          setEvents([]);
          setLoading(false);
        }
        return;
      }

      const [
        { data: profData },
        { data: pantry },
        { data: shopping },
        { data: notes },
        { data: evts },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("pantry_items").select("*").order("expiry_date"),
        supabase.from("shopping_list").select("*").order("created_at", { ascending: false }),
        supabase.from("app_notifications").select("*").order("created_at", { ascending: false }),
        supabase.from("inventory_events").select("*").order("created_at", { ascending: false }).limit(100),
      ]);

      if (!cancelled) {
        const emailFallbackName = user.email ? user.email.split("@")[0] : "User";
        if (profData) {
          setProfile({
            id: String(profData.id),
            fullName: String(profData.full_name || emailFallbackName),
            householdSize: Number(profData.household_size || 1),
            currency: String(profData.currency || "PKR"),
            country: String(profData.country || "PK"),
            gender: String(profData.gender || "Prefer not to say"),
            avatarUrl: profData.avatar_url ? String(profData.avatar_url) : "",
            email: user.email || "",
            createdAt: String(profData.created_at),
            updatedAt: String(profData.updated_at),
          });
        } else {
          setProfile({
            id: user.id,
            fullName: (user.user_metadata?.full_name as string) || emailFallbackName,
            householdSize: Number(user.user_metadata?.household_size || 1),
            currency: "PKR",
            country: "PK",
            gender: "Prefer not to say",
            email: user.email || "",
            avatarUrl: "",
          });
        }

        if (pantry) setItems(pantry.map((row) => mapPantryRow(row)));
        if (shopping) setShoppingItems(shopping.map((row) => ({ id: String(row.id), userId: String(row.user_id), productName: String(row.product_name), quantity: Number(row.quantity), unit: String(row.unit), completed: Boolean(row.completed), createdAt: String(row.created_at) })));
        if (notes) setNotifications(notes.map((row) => ({ id: String(row.id), userId: String(row.user_id), title: String(row.title), message: String(row.message), type: row.type as AppNotification["type"], itemId: row.item_id ? String(row.item_id) : undefined, read: Boolean(row.is_read), createdAt: String(row.created_at) })));
        if (evts) setEvents(evts.map((row) => ({ id: String(row.id), userId: String(row.user_id), itemId: row.item_id ? String(row.item_id) : undefined, eventType: String(row.event_type), details: (row.details as Record<string, unknown>) || {}, createdAt: String(row.created_at) })));

        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [mode]);

  useEffect(() => {
    persist(items, shoppingItems, notifications, events, profile);
  }, [items, shoppingItems, notifications, events, profile, persist]);

  const addItem = useCallback(async (input: PantryItemInput) => {
    if (mode === "supabase") {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session has expired. Please sign in again.");
      const { data, error } = await supabase.from("pantry_items").insert({ ...pantryToRow(input), user_id: user.id }).select().single();
      if (error) throw new Error(error.message || "Failed to save grocery item.");
      const newItem = mapPantryRow(data);
      setItems((current) => [newItem, ...current]);
      await recordEvent("item_added", { productName: newItem.productName, category: newItem.category, quantity: newItem.quantity, unit: newItem.unit, price: newItem.price, expiryDate: newItem.expiryDate }, newItem.id);
      return;
    }
    const stamp = new Date().toISOString();
    const newItem: PantryItem = { id: crypto.randomUUID(), ...input, status: "available", createdAt: stamp, updatedAt: stamp };
    setItems((current) => [newItem, ...current]);
    await recordEvent("item_added", { productName: newItem.productName, category: newItem.category, quantity: newItem.quantity, unit: newItem.unit, price: newItem.price, expiryDate: newItem.expiryDate }, newItem.id);
  }, [mode, recordEvent]);

  const updateItem = useCallback(async (id: string, patch: Partial<PantryItem>) => {
    const existing = items.find((i) => i.id === id);
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
      if (error) throw new Error(error.message || "Failed to update item.");
      const updated = mapPantryRow(data);
      setItems((current) => current.map((item) => item.id === id ? updated : item));

      let eventType = "item_updated";
      if (patch.status && patch.status !== existing?.status) {
        eventType = `marked_${patch.status}`;
      } else if (patch.quantity !== undefined && patch.quantity !== existing?.quantity) {
        eventType = "quantity_updated";
      } else if (patch.storageLocation !== undefined && patch.storageLocation !== existing?.storageLocation) {
        eventType = "storage_changed";
      } else if (patch.opened !== undefined && patch.opened !== existing?.opened) {
        eventType = "item_opened";
      }
      await recordEvent(eventType, { productName: updated.productName, previous: existing, new: patch }, id);
      return;
    }
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));
    await recordEvent("item_updated", { productName: existing?.productName, patch }, id);
  }, [mode, items, recordEvent]);

  const deleteItem = useCallback(async (id: string) => {
    const existing = items.find((i) => i.id === id);
    if (mode === "supabase") {
      const { error } = await createClient().from("pantry_items").delete().eq("id", id);
      if (error) throw new Error(error.message || "Failed to delete item.");
    }
    setItems((current) => current.filter((item) => item.id !== id));
    await recordEvent("item_deleted", { productName: existing?.productName, details: existing }, id);
  }, [mode, items, recordEvent]);

  const markStatus = useCallback(async (id: string, status: PantryStatus, wasteReason?: string) => {
    await updateItem(id, { status, statusDate: new Date().toISOString().slice(0, 10), wasteReason });
  }, [updateItem]);

  const addShoppingItem = useCallback(async (productName: string, quantity: number, unit: string) => {
    if (mode === "supabase") {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session has expired. Please sign in again.");
      const { data, error } = await supabase.from("shopping_list").insert({ user_id: user.id, product_name: productName.trim(), quantity, unit }).select().single();
      if (error) throw new Error(error.message || "Failed to add shopping item.");
      const newItem: ShoppingItem = { id: String(data.id), userId: String(data.user_id), productName: String(data.product_name), quantity: Number(data.quantity), unit: String(data.unit), completed: Boolean(data.completed), createdAt: String(data.created_at) };
      setShoppingItems((current) => [newItem, ...current]);
      await recordEvent("shopping_item_added", { productName: newItem.productName, quantity: newItem.quantity, unit: newItem.unit });
      return;
    }
    const newItem: ShoppingItem = { id: crypto.randomUUID(), productName: productName.trim(), quantity, unit, completed: false, createdAt: new Date().toISOString() };
    setShoppingItems((current) => [newItem, ...current]);
    await recordEvent("shopping_item_added", { productName: newItem.productName, quantity: newItem.quantity, unit: newItem.unit });
  }, [mode, recordEvent]);

  const toggleShoppingItem = useCallback(async (id: string) => {
    const current = shoppingItems.find((item) => item.id === id);
    if (!current) return;
    const completed = !current.completed;
    if (mode === "supabase") {
      const { error } = await createClient().from("shopping_list").update({ completed }).eq("id", id);
      if (error) throw new Error(error.message || "Failed to update shopping item.");
    }
    setShoppingItems((all) => all.map((item) => item.id === id ? { ...item, completed } : item));
    if (completed) {
      await recordEvent("shopping_item_completed", { productName: current.productName, quantity: current.quantity });
    }
  }, [mode, shoppingItems, recordEvent]);

  const deleteShoppingItem = useCallback(async (id: string) => {
    if (mode === "supabase") {
      const { error } = await createClient().from("shopping_list").delete().eq("id", id);
      if (error) throw new Error(error.message || "Failed to delete shopping item.");
    }
    setShoppingItems((current) => current.filter((item) => item.id !== id));
  }, [mode]);

  const markNotificationRead = useCallback(async (id: string) => {
    if (mode === "supabase") {
      const { error } = await createClient().from("app_notifications").update({ is_read: true }).eq("id", id);
      if (error) throw new Error(error.message || "Failed to update notification.");
    }
    setNotifications((current) => current.map((note) => note.id === id ? { ...note, read: true } : note));
  }, [mode]);

  const markAllNotificationsRead = useCallback(async () => {
    if (mode === "supabase") {
      const { error } = await createClient().from("app_notifications").update({ is_read: true }).eq("is_read", false);
      if (error) throw new Error(error.message || "Failed to update notifications.");
    }
    setNotifications((current) => current.map((note) => ({ ...note, read: true })));
  }, [mode]);

  const deleteNotification = useCallback(async (id: string) => {
    if (mode === "supabase") {
      const { error } = await createClient().from("app_notifications").delete().eq("id", id);
      if (error) throw new Error(error.message || "Failed to delete notification.");
    }
    setNotifications((current) => current.filter((note) => note.id !== id));
  }, [mode]);

  const updateUserProfile = useCallback(async (patch: Partial<UserProfile>) => {
    if (mode === "supabase") {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required.");

      const row: Record<string, unknown> = {};
      if (patch.fullName !== undefined) row.full_name = patch.fullName.trim();
      if (patch.householdSize !== undefined) row.household_size = patch.householdSize;
      if (patch.currency !== undefined) row.currency = patch.currency;
      if (patch.country !== undefined) row.country = patch.country;
      if (patch.gender !== undefined) row.gender = patch.gender;
      if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl;

      const { data, error } = await supabase.from("profiles").upsert({ id: user.id, ...row }).select().single();
      if (error) throw new Error(error.message || "Failed to update profile.");

      setProfile({
        id: String(data.id),
        fullName: String(data.full_name || patch.fullName || user.email?.split("@")[0]),
        householdSize: Number(data.household_size || 1),
        currency: String(data.currency || "PKR"),
        country: String(data.country || "PK"),
        gender: String(data.gender || patch.gender || "Prefer not to say"),
        avatarUrl: data.avatar_url ? String(data.avatar_url) : patch.avatarUrl || "",
        email: user.email || "",
        createdAt: String(data.created_at),
        updatedAt: String(data.updated_at),
      });
      return;
    }

    setProfile((cur) => cur ? { ...cur, ...patch } : { id: "demo-user", fullName: patch.fullName || "Demo User", householdSize: patch.householdSize || 2, currency: patch.currency || "PKR", country: patch.country || "PK", gender: patch.gender || "Prefer not to say", avatarUrl: patch.avatarUrl || "", email: "demo@pantrypulse.app" });
  }, [mode]);

  const exportDataAsJSON = useCallback(() => {
    const payload = {
      profile,
      pantryItems: items,
      shoppingList: shoppingItems,
      events,
      notifications,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  }, [profile, items, shoppingItems, events, notifications]);

  const exportDataAsCSV = useCallback(() => {
    const headers = ["ID", "Product Name", "Category", "Quantity", "Unit", "Price", "Purchase Date", "Expiry Date", "Storage Location", "Status"];
    const rows = items.map((i) => [
      i.id,
      `"${i.productName.replace(/"/g, '""')}"`,
      `"${i.category.replace(/"/g, '""')}"`,
      i.quantity,
      `"${i.unit}"`,
      i.price,
      i.purchaseDate,
      i.expiryDate,
      `"${i.storageLocation}"`,
      i.status,
    ]);
    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }, [items]);

  const clearPantryData = useCallback(async () => {
    if (mode === "supabase") {
      const supabase = createClient();
      const { error } = await supabase.from("pantry_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw new Error(error.message);
    }
    setItems([]);
  }, [mode]);

  const clearEventHistory = useCallback(async () => {
    if (mode === "supabase") {
      const supabase = createClient();
      const { error } = await supabase.from("inventory_events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw new Error(error.message);
    }
    setEvents([]);
  }, [mode]);

  const clearShoppingData = useCallback(async () => {
    if (mode === "supabase") {
      const supabase = createClient();
      const { error } = await supabase.from("shopping_list").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw new Error(error.message);
    }
    setShoppingItems([]);
  }, [mode]);

  const resetDemoData = useCallback(() => {
    setItems(samplePantryItems);
    setShoppingItems(sampleShoppingItems);
    setNotifications(sampleNotifications);
    setEvents([]);
    setProfile(defaultProfile);
  }, []);

  const clearLocalData = useCallback(() => {
    setItems([]);
    setShoppingItems([]);
    setNotifications([]);
    setEvents([]);
    if (typeof window !== "undefined") Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  }, []);

  const value = useMemo(() => ({
    profile, items, shoppingItems, notifications, events, loading, mode,
    addItem, updateItem, deleteItem, markStatus,
    addShoppingItem, toggleShoppingItem, deleteShoppingItem,
    markNotificationRead, markAllNotificationsRead, deleteNotification,
    updateUserProfile, exportDataAsJSON, exportDataAsCSV,
    clearPantryData, clearEventHistory, clearShoppingData,
    resetDemoData, clearLocalData,
  }), [
    profile, items, shoppingItems, notifications, events, loading, mode,
    addItem, updateItem, deleteItem, markStatus,
    addShoppingItem, toggleShoppingItem, deleteShoppingItem,
    markNotificationRead, markAllNotificationsRead, deleteNotification,
    updateUserProfile, exportDataAsJSON, exportDataAsCSV,
    clearPantryData, clearEventHistory, clearShoppingData,
    resetDemoData, clearLocalData,
  ]);

  return <PantryContext.Provider value={value}>{children}</PantryContext.Provider>;
}

export function usePantry() {
  const context = useContext(PantryContext);
  if (!context) throw new Error("usePantry must be used inside PantryProvider.");
  return context;
}
