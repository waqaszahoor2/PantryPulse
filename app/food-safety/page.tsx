import Link from "next/link";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { HeaderBackButton } from "@/components/ui/header-back-button";

export const metadata = {
  title: "Food Safety Disclaimer",
  description: "Important food safety guidelines and disclaimers for PantryPulse users.",
};

export default function FoodSafetyPage() {
  return (
    <div className="landing-shell">
      <header className="landing-header" style={{ padding: "0.75rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        <HeaderBackButton />
      </header>

      <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1.5rem" }}>
        <article className="panel" style={{ padding: "2.5rem" }}>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--red)" }}>
            <ShieldAlert size={18} /> Essential Notice
          </div>
          <h1 style={{ fontSize: "2.2rem", margin: "0.5rem 0 1.5rem" }}>Food Safety Disclaimer</h1>

          <div className="form-message warning" style={{ fontSize: "1.05rem", lineHeight: "1.6", padding: "1.25rem", borderRadius: "10px", margin: "1.5rem 0" }}>
            <strong>
              PantryPulse provides storage, expiry, and planning estimates only. It does not determine whether food is safe to consume. When uncertain, discard the product and follow official food-safety guidance.
            </strong>
          </div>

          <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: "1.6", marginTop: "2rem" }}>
            <div>
              <h3>How to Use PantryPulse Estimates</h3>
              <p>
                Our risk scoring algorithm uses user-entered expiry dates, storage locations (Pantry, Refrigerator, Freezer), package opened status, and perishability categories to calculate planning priority queues.
              </p>
            </div>

            <div>
              <h3>Sensory Inspection & Safety Guidance</h3>
              <div style={{ padding: "1rem", background: "var(--surface-soft)", borderRadius: "10px", borderLeft: "4px solid var(--primary)", marginBottom: "1rem" }}>
                <p style={{ margin: 0, fontWeight: 500 }}>
                  Discard food showing mold, unusual odor, damaged packaging, unexpected color, or abnormal texture. However, food can still be unsafe even when it looks and smells normal. Never rely only on sensory inspection. Follow package instructions, storage duration, time and temperature guidance, and advice from official food-safety authorities.
                </p>
              </div>
            </div>

            <div>
              <h3>Official Food Safety Authorities</h3>
              <p>For verified guidelines on storage temperature, food handling, and shelf-life recommendations, consult official public resources:</p>
              <ul style={{ paddingLeft: "1.25rem", display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
                <li>
                  <a href="https://www.foodsafety.gov" target="_blank" rel="noopener noreferrer" className="link-text" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    FoodSafety.gov (U.S. Official Resource) <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a href="https://www.fda.gov/food" target="_blank" rel="noopener noreferrer" className="link-text" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    U.S. Food and Drug Administration (FDA) <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a href="https://www.who.int/news-room/fact-sheets/detail/food-safety" target="_blank" rel="noopener noreferrer" className="link-text" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    World Health Organization (WHO) Food Safety <ExternalLink size={14} />
                  </a>
                </li>
              </ul>
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
