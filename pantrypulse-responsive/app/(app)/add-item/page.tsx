"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, PackagePlus, Refrigerator, Snowflake, Warehouse } from "lucide-react";
import { z } from "zod";
import { CATEGORIES, PRODUCT_EMOJI, STORAGE_LOCATIONS, UNITS } from "@/lib/constants";
import { usePantry } from "@/lib/data/provider";
import { calculateRisk, expiryLabel } from "@/lib/risk";
import type { PantryItem, PantryItemInput, StorageLocation } from "@/lib/types";
import { RiskBadge } from "@/components/ui/risk-badge";

const schema = z.object({
  productName: z.string().trim().min(2, "Enter a product name.").max(80),
  category: z.string().min(1),
  quantity: z.number().positive("Quantity must be above zero.").max(10000),
  unit: z.string().min(1),
  price: z.number().min(0).max(100000000),
  purchaseDate: z.string().min(1),
  expiryDate: z.string().min(1),
  storageLocation: z.enum(["Pantry","Refrigerator","Freezer","Kitchen counter","Other"]),
  opened: z.boolean(),
  notes: z.string().max(500).optional(),
}).refine((data)=>data.expiryDate >= data.purchaseDate,{message:"Expiry date cannot be before the purchase date.",path:["expiryDate"]});

function today(){ return new Date().toISOString().slice(0,10); }
function plusDays(days:number){ const d=new Date(); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); }

export default function AddItemPage(){
  const router=useRouter(); const {items,addItem}=usePantry();
  const [form,setForm]=useState<PantryItemInput>({productName:"",category:"Dairy",quantity:1,unit:"Piece",price:0,purchaseDate:today(),expiryDate:plusDays(7),storageLocation:"Refrigerator",opened:false,notes:""});
  const [message,setMessage]=useState(""); const [saving,setSaving]=useState(false);
  const similarCount=items.filter((item)=>item.status==="available"&&item.productName.trim().toLowerCase()===form.productName.trim().toLowerCase()&&form.productName.trim()).length;
  const preview=useMemo<PantryItem>(()=>({id:"preview",...form,status:"available",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}),[form]);
  const risk=calculateRisk(preview,similarCount);
  async function submit(event:React.FormEvent){ event.preventDefault(); setMessage(""); const parsed=schema.safeParse(form); if(!parsed.success){setMessage(parsed.error.issues[0]?.message??"Check the form.");return;} setSaving(true); try{await addItem(parsed.data); setMessage("Grocery saved successfully."); setTimeout(()=>router.push("/pantry"),500);}catch(error){setMessage(error instanceof Error?error.message:"Unable to save grocery.");}finally{setSaving(false);} }
  const storageIcons={Pantry:Warehouse,Refrigerator:Refrigerator,Freezer:Snowflake,"Kitchen counter":PackagePlus,Other:PackagePlus} as const;
  return <div className="page-stack"><section className="page-heading-row"><div><p className="eyebrow">Inventory entry</p><h1>Add Grocery</h1><p>Record what you bought and when it should be used.</p></div></section><div className="add-layout"><form className="panel form-panel" onSubmit={submit}><div className="panel-header"><div><p className="eyebrow">Product information</p><h2>Grocery details</h2></div></div>{message&&<p className={`form-message ${message.includes("success")?"success":"error"}`}>{message}</p>}<div className="form-grid two"><label className="field full"><span>Product name</span><input value={form.productName} onChange={(e)=>setForm({...form,productName:e.target.value})} placeholder="e.g. Milk" maxLength={80} required/></label><label className="field"><span>Category</span><select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}>{CATEGORIES.map((value)=><option key={value}>{value}</option>)}</select></label><label className="field"><span>Price (PKR)</span><input type="number" min="0" step="0.01" value={form.price} onChange={(e)=>setForm({...form,price:Number(e.target.value)})}/></label><label className="field"><span>Quantity</span><input type="number" min="0.01" step="0.01" value={form.quantity} onChange={(e)=>setForm({...form,quantity:Number(e.target.value)})} required/></label><label className="field"><span>Unit</span><select value={form.unit} onChange={(e)=>setForm({...form,unit:e.target.value})}>{UNITS.map((value)=><option key={value}>{value}</option>)}</select></label><label className="field"><span>Purchase date</span><input type="date" value={form.purchaseDate} onChange={(e)=>setForm({...form,purchaseDate:e.target.value})} required/></label><label className="field"><span>Expiry date</span><input type="date" value={form.expiryDate} onChange={(e)=>setForm({...form,expiryDate:e.target.value})} required/></label></div><fieldset className="storage-fieldset"><legend>Storage location</legend><div className="storage-grid">{STORAGE_LOCATIONS.map((location)=>{const Icon=storageIcons[location];return <button type="button" key={location} className={form.storageLocation===location?"selected":""} onClick={()=>setForm({...form,storageLocation:location as StorageLocation})}><Icon size={19}/><span>{location}</span></button>})}</div></fieldset><label className="checkbox-row"><input type="checkbox" checked={form.opened} onChange={(e)=>setForm({...form,opened:e.target.checked})}/><span>The package is already open</span></label><label className="field"><span>Notes <small>Optional</small></span><textarea maxLength={500} rows={4} value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} placeholder="Anything useful for your household…"/></label><div className="form-actions"><button type="button" className="button button-ghost" onClick={()=>router.back()}>Cancel</button><button className="button button-primary" disabled={saving}>{saving?"Saving…":"Save grocery"}</button></div></form>
  <aside className="preview-column"><article className="panel live-preview"><div className="panel-header"><div><p className="eyebrow">Live preview</p><h2>How this item will appear</h2></div></div><span className="preview-product-visual">{PRODUCT_EMOJI[form.category]??"🛒"}</span><h3>{form.productName||"Product name"}</h3><p>{form.category} · {form.quantity} {form.unit}</p><dl><div><dt>Storage</dt><dd>{form.storageLocation}</dd></div><div><dt>Expiry</dt><dd>{expiryLabel(risk.daysRemaining)}</dd></div><div><dt>Initial risk</dt><dd><RiskBadge level={risk.level} score={risk.score}/></dd></div></dl>{similarCount>0&&<div className="duplicate-warning"><AlertCircle size={18}/><span>You already have {similarCount} similar item{similarCount>1?"s":""}.</span></div>}<div className="preview-tip"><CheckCircle2 size={18}/><span>Risk is transparent and recalculates when quantity, expiry, storage, or opened status changes.</span></div></article><p className="safety-note"><AlertCircle size={15}/> This score is for planning, not a food-safety determination.</p></aside></div></div>;
}
