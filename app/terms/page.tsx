import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { buildGmailComposeUrl, getFixedSupportEmail } from "@/lib/support/build-email-links";

export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using PantryPulse.",
};

export default function TermsPage() {
  const supportEmail = getFixedSupportEmail();
  const gmailUrl = buildGmailComposeUrl({
    recipient: supportEmail,
    fullName: "PantryPulse User",
    email: supportEmail,
    category: "General feedback",
    subject: "Terms of Service Query",
    message: "I have a question regarding the Terms of Service.",
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
            <FileText size={18} /> User Agreement
          </div>
          <h1 style={{ fontSize: "2.2rem", margin: "0.5rem 0 1.5rem" }}>Terms of Service</h1>

          <p className="muted" style={{ fontSize: "0.9rem", marginBottom: "2rem" }}>
            Last updated: August 2026. By accessing or using PantryPulse, you agree to these Terms of Service.
          </p>

          <section style={{ display: "flex", flexDirection: "column", gap: "1.75rem", lineHeight: "1.6" }}>
            <div>
              <h3>1. Description of Service</h3>
              <p>
                PantryPulse is a household inventory tracking application designed to organize groceries, estimate storage duration, highlight expiry priorities, and reduce food waste.
              </p>
            </div>

            <div>
              <h3>2. Food Safety & Planning Disclaimer</h3>
              <p>
                PantryPulse provides storage, expiry, and planning estimates only. It does not determine whether food is safe to consume. When uncertain, discard the product and follow official food-safety guidance. User relies on estimates at their own discretion.
              </p>
            </div>

            <div>
              <h3>3. User Accounts & Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized access to your account.
              </p>
            </div>

            <div>
              <h3>4. Acceptable Use</h3>
              <p>
                You agree not to misuse PantryPulse, reverse-engineer system endpoints, or attempt unauthorized database operations. We reserve the right to suspend accounts that violate platform policies.
              </p>
            </div>

            <div>
              <h3>5. Support & Legal Inquiries</h3>
              <p>
                If you have questions regarding these terms, send a support inquiry directly via Gmail or email:
              </p>
              <div style={{ marginTop: "0.75rem" }}>
                <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="button button-soft button-small" style={{ gap: "0.4rem" }}>
                  Contact Support <ExternalLink size={14} />
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
