"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { STORAGE_LOCATIONS, UNITS } from "@/lib/constants";
import type { PantryItem, StorageLocation } from "@/lib/types";

export function ItemEditor({ item, onClose, onSave }: { item: PantryItem | null; onClose: () => void; onSave: (id: string, patch: Partial<PantryItem>) => Promise<void> }) {
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("Piece");
  const [expiryDate, setExpiryDate] = useState("");
  const [storageLocation, setStorageLocation] = useState<StorageLocation>("Pantry");
  const [opened, setOpened] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!item) return;
    setQuantity(item.quantity); setUnit(item.unit); setExpiryDate(item.expiryDate); setStorageLocation(item.storageLocation); setOpened(item.opened);
  }, [item]);

  if (!item) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-title">
        <div className="modal-header">
          <div><p className="eyebrow">Edit grocery</p><h2 id="edit-title">{item.productName}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close editor"><X size={19} /></button>
        </div>
        <div className="form-grid two">
          <label className="field"><span>Quantity</span><input type="number" min="0.01" step="0.01" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></label>
          <label className="field"><span>Unit</span><select value={unit} onChange={(event) => setUnit(event.target.value)}>{UNITS.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="field"><span>Expiry date</span><input type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} /></label>
          <label className="field"><span>Storage</span><select value={storageLocation} onChange={(event) => setStorageLocation(event.target.value as StorageLocation)}>{STORAGE_LOCATIONS.map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        <label className="checkbox-row"><input type="checkbox" checked={opened} onChange={(event) => setOpened(event.target.checked)} /><span>Package is open</span></label>
        <div className="modal-actions"><button className="button button-ghost" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={saving || !expiryDate || quantity <= 0} onClick={async () => { setSaving(true); try { await onSave(item.id, { quantity, unit, expiryDate, storageLocation, opened }); onClose(); } finally { setSaving(false); } }}>{saving ? "Saving…" : "Save changes"}</button></div>
      </section>
    </div>
  );
}
