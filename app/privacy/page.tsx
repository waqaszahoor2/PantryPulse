import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how PantryPulse collects, protects, and handles your household data.",
};

export default function PrivacyPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@pantrypulse.app";

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <Logo />
        <Link href="/" className="button button-ghost button-small">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>

      <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <article className="panel" style={{ padding: "2.5rem" }}>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={16} /> Privacy & Security
          </div>
          <h1 style={{ fontSize: "2.2rem", margin: "0.5rem 0 1.5rem" }}>Privacy Policy</h1>
          <p className="muted" style={{ marginBottom: "2rem" }}>Last updated: August 2026</p>

          <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6" }}>
            <div>
              <h3>1. Information We Collect</h3>
              <p>
                PantryPulse collects information necessary to provide household grocery tracking, expiry alerts, and waste reduction analytics. This includes:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                <li><strong>Account details:</strong> Email address, encrypted authentication tokens, optional full name, household size, preferred currency, and country.</li>
                <li><strong>Pantry data:</strong> Product names, categories, quantities, purchase dates, expiry dates, storage locations, package opened status, and optional notes.</li>
                <li><strong>Activity events:</strong> Actions such as adding, editing, consuming, wasting, donating items, or updating shopping items.</li>
              </ul>
            </div>

            <div>
              <h3>2. Purpose of Data Processing</h3>
              <p>
                We process your data strictly to calculate risk urgency scores, render dashboard analytics, issue expiry notifications, and synchronize your household pantry items across your devices.
              </p>
            </div>

            <div>
              <h3>3. How Supabase Stores Your Data</h3>
              <p>
                Your data is stored securely in PostgreSQL database infrastructure hosted by Supabase. Access controls are strictly enforced at the database level using <strong>Row Level Security (RLS)</strong>.
              </p>
            </div>

            <div>
              <h3>4. User Data Isolation & Admin Maintenance Access</h3>
              <p>
                Row Level Security policies guarantee that users cannot read, modify, or delete another household’s data. Authorized system administrators may access limited database tables solely for infrastructure maintenance, data backup, security diagnostics, or technical troubleshooting.
              </p>
            </div>

            <div>
              <h3>5. Data Export & Deletion Rights</h3>
              <p>
                You retain full ownership of your data. At any time within your Account Settings, you can:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                <li>Export all your pantry records, shopping list items, and activity history in structured <strong>JSON</strong> or <strong>CSV</strong> format.</li>
                <li>Clear individual items, inventory history, or your complete pantry list instantly.</li>
                <li>Perform permanent account deletion, which securely purges your user profile, pantry items, activity logs, and authentication records.</li>
              </ul>
            </div>

            <div>
              <h3>6. Cookies & Session Management</h3>
              <p>
                PantryPulse uses secure HTTP-only cookies and local browser storage strictly for authenticating your active session and saving local theme preferences. We do not use third-party tracking cookies or sell your personal information.
              </p>
            </div>

            <div>
              <h3>7. Contact Us</h3>
              <p>
                For privacy inquiries or technical support, contact our support team at:{" "}
                <a href={`mailto:${supportEmail}`} className="link-text" style={{ fontWeight: 600 }}>{supportEmail}</a>.
              </p>
            </div>
          </section>
        </article>
      </main>

      <footer className="landing-footer">
        <Logo />
        <p>© 2026 PantryPulse. Track food. Save money. Waste less.</p>
      </footer>
    </div>
  );
}
