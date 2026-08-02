"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, Mail, Users } from "lucide-react";
import { z } from "zod";
import { Logo } from "@/components/ui/logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  householdSize: z.number().int().min(1, "Minimum household size is 1.").max(30, "Maximum household size is 30."),
  consent: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms, privacy policy, and food safety advice before creating an account." }) }),
});

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", householdSize: 1, consent: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [successState, setSuccessState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (!form.consent) {
      setErrorMessage("Please check the box to agree to the terms, privacy policy, and food safety disclaimer.");
      return;
    }

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setErrorMessage(parsed.error.issues[0]?.message ?? "Check your information.");
      return;
    }

    setLoading(true);
    try {
      if (process.env.NEXT_PUBLIC_DATA_MODE !== "supabase" || !isSupabaseConfigured()) {
        setSuccessState(true);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
            household_size: form.householdSize,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      if (data?.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setSuccessState(true);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!form.email || resending) return;
    setResending(true);
    setErrorMessage("");
    try {
      if (isSupabaseConfigured()) {
        const { error } = await createClient().auth.resend({
          type: "signup",
          email: form.email,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        });
        if (error) throw error;
      }
      alert("Confirmation email resent successfully. Please check your inbox and spam folder.");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to resend confirmation email.");
    } finally {
      setResending(false);
    }
  }

  if (successState) {
    return (
      <div className="auth-page">
        <div className="auth-side">
          <Logo />
          <div>
            <span className="auth-kicker">Account Created</span>
            <h1>Check your email to finish setting up your account.</h1>
            <p>We sent a secure confirmation link to verify your email address.</p>
          </div>
        </div>
        <main className="auth-main">
          <div className="auth-card" style={{ textAlign: "center" }}>
            <div style={{ margin: "0 auto 1rem", color: "#0f7d53" }}>
              <CheckCircle2 size={48} />
            </div>
            <h2>Account created successfully.</h2>
            <p className="muted" style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }}>
              We sent a confirmation link to <strong>{form.email || "your email address"}</strong>. Confirm your email, then sign in to access PantryPulse.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button onClick={handleResend} className="button button-soft button-full" disabled={resending}>
                {resending ? "Sending link…" : "Resend confirmation email"}
              </button>
              <Link href="/login" className="button button-primary button-full">
                Return to sign in
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <Logo />
        <div>
          <span className="auth-kicker">Start simply</span>
          <h1>Build a pantry your household can actually use.</h1>
          <p>Track groceries, see what needs attention, and learn where food and money are saved.</p>
        </div>
        <div className="auth-quote">Your household data remains separated and safe with Supabase Row Level Security.</div>
      </div>
      <main className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <div>
            <p className="eyebrow">Free to get started</p>
            <h2>Create account</h2>
            <p className="muted">Set up your private household account.</p>
          </div>

          {errorMessage && <p className="form-message error">{errorMessage}</p>}

          <label className="field">
            <span>Full name</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sarah Connor" />
          </label>

          <label className="field">
            <span>Email</span>
            <div className="input-with-icon">
              <Mail size={17} />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="input-with-icon">
              <LockKeyhole size={17} />
              <input type="password" minLength={8} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" />
            </div>
          </label>

          <label className="field">
            <span>Household size</span>
            <div className="input-with-icon">
              <Users size={17} />
              <input type="number" min="1" max="30" value={form.householdSize} onChange={(e) => setForm({ ...form, householdSize: Number(e.target.value) })} />
            </div>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              required
              checked={form.consent}
              onChange={(e) => {
                setForm({ ...form, consent: e.target.checked });
                if (e.target.checked) setErrorMessage("");
              }}
            />
            <span>
              I agree to the <Link href="/terms" target="_blank" className="link-text">Terms of Service</Link>, <Link href="/privacy" target="_blank" className="link-text">Privacy Policy</Link>, and <Link href="/food-safety" target="_blank" className="link-text">Food Safety Disclaimer</Link>.
            </span>
          </label>

          <button className="button button-primary button-full" disabled={loading || !form.consent}>
            {loading ? "Creating account…" : "Create account"}
          </button>

          {!form.consent && (
            <p className="muted" style={{ fontSize: "0.78rem", textAlign: "center", marginTop: "0.35rem" }}>
              Please check the box above to accept the terms before creating an account.
            </p>
          )}

          <p className="auth-switch">
            Already registered? <Link href="/login">Sign in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
