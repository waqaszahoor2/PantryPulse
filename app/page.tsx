import Link from "next/link";
import { ArrowRight, BellRing, ChartNoAxesColumnIncreasing, CheckCircle2, Leaf, LockKeyhole, ShoppingBasket, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const features = [
  { icon: ShoppingBasket, title: "Track groceries", text: "Keep quantities, prices, storage locations, and expiry dates organized in one place." },
  { icon: BellRing, title: "Act before expiry", text: "Clear urgency labels highlight what deserves attention in your kitchen today." },
  { icon: ChartNoAxesColumnIncreasing, title: "Understand your habits", text: "See real waste patterns and understand your food savings over time." },
  { icon: LockKeyhole, title: "Private by design", text: "Database-level Row Level Security keeps each household's records separate." },
];

export default function LandingPage() {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <Logo />
        <nav>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <Link href="/support">Support</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/food-safety">Food Safety</Link>
        </nav>
        <div className="landing-actions">
          <Link className="button button-ghost" href="/login">Sign in</Link>
          <Link className="button button-primary" href="/signup">Get started</Link>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-kicker"><Leaf size={16} /> Practical food tracking for real homes</span>
            <h1>Stop forgetting food in your fridge.</h1>
            <p>PantryPulse keeps your pantry organized, highlights what to use first, and helps your household waste less money and food.</p>
            <div className="hero-actions">
              <Link className="button button-primary button-large" href="/signup">
                Start tracking food <ArrowRight size={18} />
              </Link>
              <Link className="button button-ghost button-large" href="/demo">
                View interactive demo
              </Link>
            </div>
            <div className="hero-trust">
              <span><CheckCircle2 size={16} /> Free to get started</span>
              <span><CheckCircle2 size={16} /> Desktop & mobile ready</span>
              <span><CheckCircle2 size={16} /> Private household account</span>
            </div>
          </div>

          <div className="hero-preview" aria-label="PantryPulse dashboard preview">
            <div className="preview-top">
              <div>
                <span className="preview-dot" />
                <span className="preview-dot" />
                <span className="preview-dot" />
              </div>
              <span>Today's Overview</span>
            </div>
            <div className="preview-greeting">
              <p>Good morning, Household</p>
              <span>3 items need attention</span>
            </div>
            <div className="preview-stats">
              <div>
                <small>Available</small>
                <strong>24</strong>
              </div>
              <div className="warning">
                <small>Expiring soon</small>
                <strong>5</strong>
              </div>
              <div className="danger">
                <small>Value at risk</small>
                <strong>$18.40</strong>
              </div>
            </div>
            <div className="preview-panel">
              <div className="preview-panel-head">
                <strong>Use first</strong>
                <span>View all</span>
              </div>
              {[
                ["🥛", "Organic Milk", "Tomorrow", "High"],
                ["🍅", "Fresh Tomatoes", "2 days", "High"],
                ["🍞", "Whole Wheat Bread", "3 days", "Medium"],
              ].map(([emoji, name, time, risk]) => (
                <div className="preview-row" key={name}>
                  <span className="preview-food">{emoji}</span>
                  <div>
                    <strong>{name}</strong>
                    <small>{time}</small>
                  </div>
                  <span className={`mini-risk ${risk.toLowerCase()}`}>{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="feature-section" id="features">
          <div className="section-heading">
            <span>Built for daily use</span>
            <h2>A simple system that supports better household decisions.</h2>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <span><Icon size={21} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="steps-section" id="how">
          <div className="steps-copy">
            <span>How it works</span>
            <h2>Useful from the first grocery item.</h2>
            <p>No complicated setup. Add products, receive clear urgency signals, and track what you save.</p>
          </div>
          <div className="steps-grid">
            {["Add groceries with expiry dates", "Review what needs attention", "Consume, donate, or record waste", "Use insights to shop smarter"].map((text, index) => (
              <div key={text}>
                <span>{index + 1}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="privacy-section" id="privacy">
          <div>
            <span className="privacy-icon"><LockKeyhole /></span>
            <div>
              <h2>Your household data stays separate and secure.</h2>
              <p>Your pantry data remains isolated from other users using Supabase Row Level Security. We never sell your data.</p>
            </div>
          </div>
          <Link href="/signup" className="button button-primary">
            Create free account <Sparkles size={17} />
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <Logo />
        <p>© 2026 PantryPulse. Track food. Save money. Waste less.</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: "0.85rem" }}>
          <Link href="/support">Support</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/food-safety">Food Safety Disclaimer</Link>
        </div>
      </footer>
    </div>
  );
}
