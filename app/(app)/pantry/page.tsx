"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CirclePlus, Grid2X2, List, PackageSearch, Search } from "lucide-react";
import { CATEGORIES, STORAGE_LOCATIONS } from "@/lib/constants";
import { usePantry } from "@/lib/data/provider";
import type { PantryItem, PantryStatus } from "@/lib/types";
import { ProductCard } from "@/components/pantry/product-card";
import { ItemEditor } from "@/components/pantry/item-editor";
import { EmptyState } from "@/components/ui/empty-state";

export default function PantryPage() {
  const { items, updateItem, deleteItem, markStatus } = usePantry();
  const [query,setQuery]=useState(""); const [category,setCategory]=useState("All"); const [storage,setStorage]=useState("All"); const [view,setView]=useState<"grid"|"list">("grid"); const [editing,setEditing]=useState<PantryItem|null>(null);
  const available = items.filter((item)=>item.status === "available");
  const filtered = useMemo(()=>available.filter((item)=>(category==="All"||item.category===category)&&(storage==="All"||item.storageLocation===storage)&&item.productName.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>a.expiryDate.localeCompare(b.expiryDate)),[available,category,storage,query]);
  async function confirmDelete(item: PantryItem){ if(window.confirm(`Delete ${item.productName}? This cannot be undone.`)) await deleteItem(item.id); }
  async function status(id:string,status:PantryStatus){ await markStatus(id,status); }
  return <div className="page-stack"><section className="page-heading-row"><div><p className="eyebrow">Inventory</p><h1>My Pantry</h1><p>{available.length} products are currently available.</p></div><Link className="button button-primary" href="/add-item"><CirclePlus size={18}/> Add grocery</Link></section>
    <section className="filter-panel"><label className="filter-search"><Search size={17}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products…"/></label><select aria-label="Category filter" value={category} onChange={(e)=>setCategory(e.target.value)}><option>All</option>{CATEGORIES.map((value)=><option key={value}>{value}</option>)}</select><select aria-label="Storage filter" value={storage} onChange={(e)=>setStorage(e.target.value)}><option>All</option>{STORAGE_LOCATIONS.map((value)=><option key={value}>{value}</option>)}</select><div className="view-toggle"><button className={view==="grid"?"active":""} onClick={()=>setView("grid")} aria-label="Grid view"><Grid2X2 size={17}/></button><button className={view==="list"?"active":""} onClick={()=>setView("list")} aria-label="List view"><List size={17}/></button></div></section>
    {filtered.length ? <section className={view==="grid"?"product-grid":"product-list-view"}>{filtered.map((item)=><ProductCard key={item.id} item={item} similarCount={available.filter((other)=>other.id!==item.id&&other.productName.toLowerCase()===item.productName.toLowerCase()).length} onEdit={setEditing} onDelete={confirmDelete} onStatus={status}/>)}</section> : <EmptyState icon={PackageSearch} title="No matching products" description="Change your filters or add a new grocery item." action="Add grocery" href="/add-item"/>}
    <ItemEditor item={editing} onClose={()=>setEditing(null)} onSave={updateItem}/>
  </div>;
}
