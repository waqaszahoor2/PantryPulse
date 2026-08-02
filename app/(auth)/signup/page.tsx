"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Users } from "lucide-react";
import { z } from "zod";
import { Logo } from "@/components/ui/logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const schema = z.object({ name: z.string().trim().min(2, "Enter your name."), email: z.string().email("Enter a valid email."), password: z.string().min(8, "Use at least 8 characters."), householdSize: z.number().int().min(1).max(30) });

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", householdSize: 1 });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    const parsed = schema.safeParse(form);
    if (!parsed.success) { setMessage(parsed.error.issues[0]?.message ?? "Check your information."); return; }
    setLoading(true);
    try {
      if (process.env.NEXT_PUBLIC_DATA_MODE !== "supabase" || !isSupabaseConfigured()) { router.push("/dashboard"); return; }
      const { error } = await createClient().auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.name, household_size: form.householdSize } } });
      if (error) throw error;
      setMessage("Account created. Check your email if confirmation is enabled.");
      setTimeout(() => router.push("/dashboard"), 900);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to create account."); }
    finally { setLoading(false); }
  }

  return <div className="auth-page"><div className="auth-side"><Logo /><div><span className="auth-kicker">Start simply</span><h1>Build a pantry your household can actually use.</h1><p>Add groceries, see what needs attention, and learn where money is being lost.</p></div><div className="auth-quote">Your personal Gmail remains private. Add a separate support email later through Vercel settings.</div></div><main className="auth-main"><form className="auth-card" onSubmit={submit}><div><p className="eyebrow">Free portfolio MVP</p><h2>Create account</h2><p className="muted">This screen works in demo mode now and connects to Supabase when you add environment variables.</p></div>{message && <p className={`form-message ${message.startsWith("Account") ? "success" : "error"}`}>{message}</p>}<label className="field"><span>Full name</span><input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Ali Khan" /></label><label className="field"><span>Email</span><div className="input-with-icon"><Mail size={17}/><input type="email" required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="you@example.com" /></div></label><label className="field"><span>Password</span><div className="input-with-icon"><LockKeyhole size={17}/><input type="password" minLength={8} required value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="At least 8 characters" /></div></label><label className="field"><span>Household size</span><div className="input-with-icon"><Users size={17}/><input type="number" min="1" max="30" value={form.householdSize} onChange={(e)=>setForm({...form,householdSize:Number(e.target.value)})} /></div></label><label className="checkbox-row"><input type="checkbox" required /><span>I agree to the privacy policy and food-safety disclaimer.</span></label><button className="button button-primary button-full" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button><p className="auth-switch">Already registered? <Link href="/login">Sign in</Link></p></form></main></div>;
}
