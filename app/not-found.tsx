import Link from "next/link";
import { ArrowLeft, HelpCircle, House } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <Logo />
        <Link href="/" className="button button-ghost button-small">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </header>

      <main style={{ maxWidth: "600px", margin: "4rem auto", padding: "0 1.5rem", textAlign: "center" }}>
        <div className="panel" style={{ padding: "3rem 2rem" }}>
          <span className="eyebrow">404 Page Not Found</span>
          <h1 style={{ fontSize: "2.2rem", margin: "0.5rem 0 1rem" }}>Page not found</h1>
          <p className="muted" style={{ marginBottom: "2rem" }}>
            The page you are looking for might have been moved, removed, or is temporarily unavailable.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="button button-primary">
              <House size={18} /> Go to Dashboard
            </Link>
            <Link href="/support" className="button button-soft">
              <HelpCircle size={18} /> Contact Support
            </Link>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <Logo />
        <p>© 2026 PantryPulse. Track food. Save money. Waste less.</p>
        <Link href="/support" className="link-text" style={{ fontSize: "0.78rem" }}>
          Support
        </Link>
      </footer>
    </div>
  );
}
