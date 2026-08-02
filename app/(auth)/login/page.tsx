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
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      if (process.env.NEXT_PUBLIC_DATA_MODE !== "supabase" || !isSupabaseConfigured()) {
        router.push("/dashboard");
        return;
      }
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your details and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Your email address has not been confirmed yet. Please check your inbox for the confirmation link.");
        }
        throw error;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Logo />
        <div>
          <span className="auth-kicker">Welcome back</span>
          <h1>Know what to use before it is forgotten.</h1>
          <p>Sign in to review your household pantry, shopping list, and waste reduction progress.</p>
        </div>
        <div className="auth-quote">“A clear, organized kitchen makes everyday meals simpler.”</div>
      </div>
      <main className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <div>
            <p className="eyebrow">PantryPulse Sign In</p>
            <h2>Sign in</h2>
            <p className="muted">Enter your registered email and password to access your household account.</p>
          </div>

          {message && <p className="form-message error">{message}</p>}

          <label className="field">
            <span>Email</span>
            <div className="input-with-icon">
              <Mail size={17} />
              <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="input-with-icon">
              <LockKeyhole size={17} />
              <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
            </div>
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/forgot-password" style={{ fontSize: ".8rem", fontWeight: 600, color: "#0f7d53" }}>
              Forgot password?
            </Link>
          </div>

          <button className="button button-primary button-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <Link className="button button-soft button-full" href="/demo">
            Try public demo
          </Link>

          <p className="auth-switch">
            New to PantryPulse? <Link href="/signup">Create an account</Link>
          </p>

          <p className="auth-switch" style={{ marginTop: "-0.5rem", fontSize: "0.78rem" }}>
            Need assistance? <Link href="/support">Contact Support</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
