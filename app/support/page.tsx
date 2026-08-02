"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, HelpCircle, Lock, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SupportForm } from "@/components/support/SupportForm";
import { getFixedSupportEmail } from "@/lib/support/build-email-links";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function SupportPage() {
  const supportEmail = getFixedSupportEmail();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured()) return;
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(Boolean(session));
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <Logo />
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {isAuthenticated ? (
            <Link href="/dashboard" className="button button-ghost button-small">
              <ArrowLeft size={16} /> Back to dashboard
            </Link>
          ) : (
            <Link href="/" className="button button-ghost button-small">
              <ArrowLeft size={16} /> Back to home
            </Link>
          )}
        </div>
      </header>

      <main className="content-area" style={{ maxWidth: "1180px", margin: "2rem auto" }}>
        <section className="page-heading-row" style={{ marginBottom: "1.5rem" }}>
          <div>
            <p className="eyebrow">Help & Assistance</p>
            <h1>Contact PantryPulse Support</h1>
            <p>Fill out the query form below. Your message will open directly in Gmail or your preferred email application.</p>
          </div>
        </section>

        {/* Responsive Desktop 2-column, Mobile 1-column layout */}
        <div className="settings-grid" style={{ alignItems: "start" }}>
          {/* Left Column: Form */}
          <section className="panel settings-section">
            <div className="settings-heading" style={{ marginBottom: "1.25rem" }}>
              <span>
                <MessageSquare size={20} />
              </span>
              <div>
                <h2>Support Inquiry Form</h2>
                <p>Prepare your support request. No password or private token required.</p>
              </div>
            </div>

            <SupportForm />
          </section>

          {/* Right Column: Support Information Card */}
          <section className="panel settings-section" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="settings-heading">
              <span>
                <HelpCircle size={20} />
              </span>
              <div>
                <h2>Support Information</h2>
                <p>How we handle support requests and household data privacy.</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ padding: "0.85rem", background: "var(--surface-soft)", borderRadius: "12px", border: "1px solid var(--line)" }}>
                <strong style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem", color: "var(--text)", marginBottom: "0.3rem" }}>
                  <Mail size={16} style={{ color: "var(--primary)" }} /> Direct Recipient Address
                </strong>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
                  All support queries are directed to our official mailbox:{" "}
                  <a href={`mailto:${supportEmail}`} className="link-text" style={{ fontWeight: 700 }}>
                    {supportEmail}
                  </a>
                </p>
              </div>

              <div style={{ padding: "0.85rem", background: "var(--surface-soft)", borderRadius: "12px", border: "1px solid var(--line)" }}>
                <strong style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem", color: "var(--text)", marginBottom: "0.3rem" }}>
                  <Clock size={16} style={{ color: "var(--primary)" }} /> Estimated Response Time
                </strong>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
                  Support requests are usually reviewed within 24–48 business hours.
                </p>
              </div>

              <div style={{ padding: "0.85rem", background: "var(--surface-soft)", borderRadius: "12px", border: "1px solid var(--line)" }}>
                <strong style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem", color: "var(--text)", marginBottom: "0.3rem" }}>
                  <Lock size={16} style={{ color: "var(--primary)" }} /> Security & Privacy Assurance
                </strong>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
                  We never ask for passwords, API keys, or session tokens in support queries. Your household database remains protected under Supabase RLS.
                </p>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 750, color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>
                Legal & Safety Resources
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.85rem" }}>
                <Link href="/privacy" className="link-text" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <ShieldCheck size={14} /> Privacy Policy
                </Link>
                <Link href="/terms" className="link-text" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <ShieldCheck size={14} /> Terms of Service
                </Link>
                <Link href="/food-safety" className="link-text" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <ShieldCheck size={14} /> Food Safety Disclaimer
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="landing-footer">
        <Logo />
        <p>© 2026 PantryPulse. Track food. Save money. Waste less.</p>
        <Link href="/support" className="link-text" style={{ fontSize: "0.78rem" }}>
          Contact Support
        </Link>
      </footer>
    </div>
  );
}
