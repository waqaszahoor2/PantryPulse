"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ForgotPasswordPage(){
 const [email,setEmail]=useState(""); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
 async function submit(event:React.FormEvent){event.preventDefault();setLoading(true);setMessage("");try{if(process.env.NEXT_PUBLIC_DATA_MODE!=="supabase"||!isSupabaseConfigured()){setMessage("Password reset becomes active after Supabase is connected.");return;}const redirectTo=`${window.location.origin}/reset-password`;const {error}=await createClient().auth.resetPasswordForEmail(email,{redirectTo});if(error)throw error;setMessage("Check your inbox for the secure reset link.");}catch(error){setMessage(error instanceof Error?error.message:"Unable to send reset email.");}finally{setLoading(false);}}
 return <div className="auth-page"><div className="auth-side"><Logo/><div><span className="auth-kicker">Account recovery</span><h1>Reset access without exposing your credentials.</h1><p>Supabase sends the reset email directly. PantryPulse never receives your password.</p></div></div><main className="auth-main"><form className="auth-card" onSubmit={submit}><div><p className="eyebrow">Secure recovery</p><h2>Forgot password</h2><p className="muted">Enter the email associated with your account.</p></div>{message&&<p className="form-message success">{message}</p>}<label className="field"><span>Email</span><div className="input-with-icon"><Mail size={17}/><input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com"/></div></label><button className="button button-primary button-full" disabled={loading}>{loading?"Sending…":"Send reset link"}</button><p className="auth-switch"><Link href="/login">Back to sign in</Link></p></form></main></div>;
}
