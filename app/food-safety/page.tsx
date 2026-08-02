import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Food Safety Disclaimer",
  description: "Important food safety guidelines and disclaimers for PantryPulse users.",
};

export default function FoodSafetyPage() {
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
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d93838" }}>
            <ShieldAlert size={18} /> Essential Notice
          </div>
          <h1 style={{ fontSize: "2.2rem", margin: "0.5rem 0 1.5rem" }}>Food Safety Disclaimer</h1>

          <div className="form-message warning" style={{ fontSize: "1.05rem", lineHeight: "1.6", padding: "1.25rem", borderRadius: "10px", margin: "1.5rem 0" }}>
            <strong>PantryPulse provides storage, expiry, and planning estimates only. It does not determine whether food is safe to consume. Always follow package instructions and official food-safety guidance. When uncertain, discard the product.</strong>
          </div>

          <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6", marginTop: "2rem" }}>
            <div>
              <h3>How to Use PantryPulse Estimates</h3>
              <p>
                Our risk scoring algorithm uses the user-entered expiry date, storage location (Pantry, Refrigerator, Freezer), package opened status, and perishable categories to calculate visual priority queues.
              </p>
            </div>

            <div>
              <h3>General Safety Guidelines</h3>
              <ul style={{ paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li><strong>Inspect visually and smell:</strong> Never consume food showing signs of mold, unusual odor, off color, or spoiled texture, regardless of the recorded expiry date.</li>
                <li><strong>Refrigeration temperature:</strong> Ensure your refrigerator maintains a temperature of 40°F (4°C) or below, and freezer at 0°F (-18°C) or below.</li>
                <li><strong>Opened packages:</strong> Once a product package is opened, its shelf life is typically reduced significantly compared to unopened sealed packages.</li>
                <li><strong>High-risk items:</strong> Raw meats, seafood, unpasteurized dairy, and cooked leftovers require extra care and prompt consumption.</li>
              </ul>
            </div>

            <div>
              <h3>Official Food Safety Resources</h3>
              <p>
                For official food storage guidelines and food safety advice, consult local public health agencies:
              </p>
              <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                <li><a href="https://www.foodsafety.gov" target="_blank" rel="noopener noreferrer" className="link-text">FoodSafety.gov (US Department of Health & Human Services)</a></li>
                <li><a href="https://www.fda.gov/food" target="_blank" rel="noopener noreferrer" className="link-text">U.S. Food and Drug Administration (FDA)</a></li>
                <li><a href="https://www.who.int/health-topics/food-safety" target="_blank" rel="noopener noreferrer" className="link-text">World Health Organization (WHO) Food Safety</a></li>
              </ul>
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
