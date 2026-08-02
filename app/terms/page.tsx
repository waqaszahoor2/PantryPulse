import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { Logo } from "@/components/ui/logo";
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
      <header className="landing-header">
        <Logo />
        <Link href="/" className="button button-ghost button-small">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>

      <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <article className="panel" style={{ padding: "2.5rem" }}>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={16} /> Agreement
          </div>
          <h1 style={{ fontSize: "2.2rem", margin: "0.5rem 0 1.5rem" }}>Terms of Service</h1>
          <p className="muted" style={{ marginBottom: "2rem" }}>Last updated: August 2026</p>

          <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6" }}>
            <div>
              <h3>1. Acceptable Use</h3>
              <p>
                PantryPulse is designed for personal household food management, grocery tracking, and waste reduction analytics. You agree to use the service lawfully and in accordance with these Terms.
              </p>
            </div>

            <div>
              <h3>2. Account Security & Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your household account. Notify us immediately at{" "}
                <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="link-text" style={{ fontWeight: 600 }}>
                  {supportEmail}
                </a>{" "}
                if you suspect unauthorized access.
              </p>
            </div>

            <div>
              <h3>3. Service Availability</h3>
              <p>
                We strive for continuous service availability; however, maintenance, server updates, or cloud provider disruptions may occasionally cause service interruptions. PantryPulse is provided on an "as is" and "as available" basis.
              </p>
            </div>

            <div>
              <h3>4. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by applicable law, PantryPulse shall not be liable for direct, indirect, incidental, or consequential damages resulting from your use of or inability to use the service, including data loss or reliance on expiry estimates.
              </p>
            </div>

            <div>
              <h3>5. Data Accuracy & Food Safety Disclaimer</h3>
              <p>
                You are responsible for the accuracy of product dates entered into the application. PantryPulse provides storage, expiry, and planning estimates only. It does not determine whether food is safe to consume. When uncertain, discard the product and follow official food-safety guidance. Refer to our{" "}
                <Link href="/food-safety" className="link-text" style={{ fontWeight: 600 }}>
                  Food Safety Disclaimer
                </Link>{" "}
                for detailed guidance.
              </p>
            </div>

            <div>
              <h3>6. Account Termination</h3>
              <p>
                You may terminate your account at any time via the Settings page. We reserve the right to suspend or terminate accounts that violate acceptable use guidelines.
              </p>
            </div>

            <div>
              <h3>7. Official Support</h3>
              <p>
                Support requests are usually reviewed within 24–48 business hours. Contact support at:{" "}
                <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="link-text" style={{ fontWeight: 600 }}>
                  {supportEmail}
                </a>
                .
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
