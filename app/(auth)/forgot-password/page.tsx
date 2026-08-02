"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (process.env.NEXT_PUBLIC_DATA_MODE !== "supabase" || !isSupabaseConfigured()) {
        setMessage("Password reset emails require an active Supabase configuration.");
        setIsSuccess(false);
        return;
      }
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setMessage("Check your inbox for a secure password reset link.");
      setIsSuccess(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send reset email.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Logo />
        <div>
          <span className="auth-kicker">Account recovery</span>
          <h1>Reset your password securely.</h1>
          <p>We send a password reset link directly to your email address.</p>
        </div>
      </div>
      <main className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <div>
            <p className="eyebrow">Secure recovery</p>
            <h2>Forgot password</h2>
            <p className="muted">Enter the email address associated with your household account.</p>
          </div>

          {message && <p className={`form-message ${isSuccess ? "success" : "error"}`}>{message}</p>}

          <label className="field">
            <span>Email address</span>
            <div className="input-with-icon">
              <Mail size={17} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </label>

          <button className="button button-primary button-full" disabled={loading}>
            {loading ? "Sending reset link…" : "Send reset link"}
          </button>

          <p className="auth-switch">
            <Link href="/login">Return to sign in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
