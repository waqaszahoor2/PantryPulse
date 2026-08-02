"use client";

import { useMemo, useState } from "react";
import { CirclePlus, ShoppingBasket, Trash2, TriangleAlert } from "lucide-react";
import { UNITS } from "@/lib/constants";
import { usePantry } from "@/lib/data/provider";
import { EmptyState } from "@/components/ui/empty-state";

export default function ShoppingListPage(){
 const {items,shoppingItems,addShoppingItem,toggleShoppingItem,deleteShoppingItem}=usePantry(); const [name,setName]=useState(""); const [quantity,setQuantity]=useState(1); const [unit,setUnit]=useState("Piece"); const [error,setError]=useState("");
 const remaining=shoppingItems.filter((item)=>!item.completed).length;
 const duplicates=useMemo(()=>new Map(items.filter((item)=>item.status==="available").map((item)=>[item.productName.toLowerCase(),item])),[items]);
 async function add(event:React.FormEvent){event.preventDefault();if(name.trim().length<2){setError("Enter a product name.");return;}setError("");await addShoppingItem(name,quantity,unit);setName("");setQuantity(1);}
 return <div className="page-stack"><section className="page-heading-row"><div><p className="eyebrow">Plan before buying</p><h1>Shopping List</h1><p>{remaining} product{remaining===1?"":"s"} remaining.</p></div></section><form className="shopping-add" onSubmit={add}><label className="field"><span>Product</span><input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Add a product…"/></label><label className="field compact"><span>Quantity</span><input type="number" min="0.01" step="0.01" value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))}/></label><label className="field compact"><span>Unit</span><select value={unit} onChange={(e)=>setUnit(e.target.value)}>{UNITS.map((value)=><option key={value}>{value}</option>)}</select></label><button className="button button-primary"><CirclePlus size={18}/> Add</button>{error&&<p className="form-message error full">{error}</p>}</form>{shoppingItems.length?<section className="shopping-list">{shoppingItems.map((entry)=>{const duplicate=duplicates.get(entry.productName.toLowerCase());return <article key={entry.id} className={`shopping-row ${entry.completed?"completed":""}`}><label className="shopping-check"><input type="checkbox" checked={entry.completed} onChange={()=>toggleShoppingItem(entry.id)}/><span/></label><div className="shopping-copy"><strong>{entry.productName}</strong><span>{entry.quantity} {entry.unit}</span>{duplicate&&<small><TriangleAlert size={14}/> You already have {duplicate.quantity} {duplicate.unit} at home.</small>}</div><button className="icon-button danger" onClick={()=>deleteShoppingItem(entry.id)} aria-label={`Delete ${entry.productName}`}><Trash2 size={17}/></button></article>})}</section>:<EmptyState icon={ShoppingBasket} title="Your shopping list is empty" description="Add items manually or use recommendations from your pantry."/>}</div>;
}
