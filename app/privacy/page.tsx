import Link from "next/link";
import { ExternalLink, LockKeyhole } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { buildGmailComposeUrl, getFixedSupportEmail } from "@/lib/support/build-email-links";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how PantryPulse collects, protects, and handles your household data.",
};

export default function PrivacyPage() {
  const supportEmail = getFixedSupportEmail();
  const gmailUrl = buildGmailComposeUrl({
    recipient: supportEmail,
    fullName: "PantryPulse User",
    email: supportEmail,
    category: "Privacy or data request",
    subject: "Privacy Policy Inquiry",
    message: "I have a question regarding the Privacy Policy or my personal data.",
  });

  return (
    <div className="landing-shell">
      <header className="landing-header" style={{ padding: "0.75rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        <HeaderBackButton />
      </header>

      <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <article className="panel" style={{ padding: "2.5rem" }}>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <LockKeyhole size={18} /> Household Data Security
          </div>
          <h1 style={{ fontSize: "2.2rem", margin: "0.5rem 0 1.5rem" }}>Privacy Policy</h1>

          <p className="muted" style={{ fontSize: "0.9rem", marginBottom: "2rem" }}>
            Last updated: August 2026. PantryPulse respects your household privacy and is committed to protecting your personal data.
          </p>

          <section style={{ display: "flex", flexDirection: "column", gap: "1.75rem", lineHeight: "1.6" }}>
            <div>
              <h3>1. Data Isolation & Security Architecture</h3>
              <p>
                Row Level Security policies are configured to prevent authenticated users from reading, modifying, or deleting another household’s data. Every query executed against our PostgreSQL backend is verified using standard JWT session tokens.
              </p>
            </div>

            <div>
              <h3>2. Information We Collect</h3>
              <ul style={{ paddingLeft: "1.25rem", display: "grid", gap: "0.5rem" }}>
                <li><strong>Account Data:</strong> Email address and profile details (e.g. household name, currency code, country). Authentication and session information managed by Supabase.</li>
                <li><strong>Pantry Records:</strong> Product names, categories, quantities, purchase dates, expiry dates, prices, and storage locations entered by you.</li>
                <li><strong>Browser Storage & Local Preferences:</strong> Demonstration state in Demo mode, theme selection (Dark/Light mode), and cached active tabs are stored locally on your device using HTML5 LocalStorage.</li>
              </ul>
            </div>

            <div>
              <h3>3. Notification Permissions</h3>
              <p>
                Browser reminders are generated locally while PantryPulse is open in your active browser. Background delivery depends on browser support and notification configuration. We do not track or sell your notification habits.
              </p>
            </div>

            <div>
              <h3>4. Third-Party Services</h3>
              <p>
                We do not sell, rent, or monetize your household data. We partner exclusively with established infrastructure providers:
              </p>
              <ul style={{ paddingLeft: "1.25rem", display: "grid", gap: "0.4rem", marginTop: "0.5rem" }}>
                <li><strong>Supabase:</strong> Encrypted Database hosting and Authentication service.</li>
                <li><strong>Vercel:</strong> Web application hosting and Serverless edge network.</li>
              </ul>
            </div>

            <div>
              <h3>5. Your Rights & Support Contact</h3>
              <p>
                You may request account deletion or data exports at any time from your account settings page. For questions regarding our privacy practices, contact support:
              </p>
              <div style={{ marginTop: "0.75rem" }}>
                <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="button button-soft button-small" style={{ gap: "0.4rem" }}>
                  Contact Privacy Support <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </section>
        </article>
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
