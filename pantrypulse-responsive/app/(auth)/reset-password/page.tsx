"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage(){
 const router=useRouter(); const [password,setPassword]=useState(""); const [confirm,setConfirm]=useState(""); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
 async function submit(event:React.FormEvent){event.preventDefault();setMessage("");if(password.length<8){setMessage("Use at least 8 characters.");return;}if(password!==confirm){setMessage("Passwords do not match.");return;}setLoading(true);try{if(!isSupabaseConfigured())throw new Error("Supabase is not configured.");const {error}=await createClient().auth.updateUser({password});if(error)throw error;setMessage("Password updated successfully.");setTimeout(()=>router.push("/dashboard"),700);}catch(error){setMessage(error instanceof Error?error.message:"Unable to update password.");}finally{setLoading(false);}}
 return <div className="auth-page"><div className="auth-side"><Logo/><div><span className="auth-kicker">Choose a new password</span><h1>Keep your household account protected.</h1><p>Use a unique password that is not reused on another service.</p></div></div><main className="auth-main"><form className="auth-card" onSubmit={submit}><div><p className="eyebrow">Account security</p><h2>Reset password</h2></div>{message&&<p className={`form-message ${message.includes("successfully")?"success":"error"}`}>{message}</p>}<label className="field"><span>New password</span><div className="input-with-icon"><LockKeyhole size={17}/><input type="password" minLength={8} required value={password} onChange={(e)=>setPassword(e.target.value)}/></div></label><label className="field"><span>Confirm password</span><div className="input-with-icon"><LockKeyhole size={17}/><input type="password" minLength={8} required value={confirm} onChange={(e)=>setConfirm(e.target.value)}/></div></label><button className="button button-primary button-full" disabled={loading}>{loading?"Updating…":"Update password"}</button></form></main></div>;
}
