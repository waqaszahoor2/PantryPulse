"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage(""); setLoading(true);
    try {
      if (process.env.NEXT_PUBLIC_DATA_MODE !== "supabase" || !isSupabaseConfigured()) {
        router.push("/dashboard"); return;
      }
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/dashboard"); router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally { setLoading(false); }
  }

  return <div className="auth-page"><div className="auth-side"><Logo /><div><span className="auth-kicker">Welcome back</span><h1>Know what to use before it is forgotten.</h1><p>Sign in to review your pantry, shopping list, and household insights.</p></div><div className="auth-quote">“A calm, clear pantry is easier to use every day.”</div></div><main className="auth-main"><form className="auth-card" onSubmit={submit}><div><p className="eyebrow">PantryPulse account</p><h2>Sign in</h2><p className="muted">Use your email and password, or continue in demo mode before Supabase is connected.</p></div>{message && <p className="form-message error">{message}</p>}<label className="field"><span>Email</span><div className="input-with-icon"><Mail size={17} /><input type="email" autoComplete="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" /></div></label><label className="field"><span>Password</span><div className="input-with-icon"><LockKeyhole size={17} /><input type="password" autoComplete="current-password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="At least 8 characters" /></div></label><div style={{display:"flex",justifyContent:"flex-end"}}><Link href="/forgot-password" style={{fontSize:".72rem",fontWeight:750,color:"#11724d"}}>Forgot password?</Link></div><button className="button button-primary button-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button><Link className="button button-soft button-full" href="/dashboard">Open demo dashboard</Link><p className="auth-switch">New to PantryPulse? <Link href="/signup">Create an account</Link></p></form></main></div>;
}
