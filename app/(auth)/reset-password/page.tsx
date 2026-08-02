"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (!isSupabaseConfigured()) throw new Error("Supabase is not configured.");
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      setMessage("Password updated successfully! Redirecting to dashboard…");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Logo />
        <div>
          <span className="auth-kicker">Set new password</span>
          <h1>Keep your account secure.</h1>
          <p>Choose a strong password with at least 8 characters.</p>
        </div>
      </div>
      <main className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <div>
            <p className="eyebrow">Account security</p>
            <h2>Reset password</h2>
            <p className="muted">Enter your new password below.</p>
          </div>

          {message && <p className={`form-message ${message.includes("successfully") ? "success" : "error"}`}>{message}</p>}

          <label className="field">
            <span>New password</span>
            <div className="input-with-icon">
              <LockKeyhole size={17} />
              <input type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
            </div>
          </label>

          <label className="field">
            <span>Confirm new password</span>
            <div className="input-with-icon">
              <LockKeyhole size={17} />
              <input type="password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" />
            </div>
          </label>

          <button className="button button-primary button-full" disabled={loading}>
            {loading ? "Updating password…" : "Update password"}
          </button>
        </form>
      </main>
    </div>
  );
}
