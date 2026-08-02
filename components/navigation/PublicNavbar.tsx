"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { HeaderBackButton } from "@/components/ui/header-back-button";
import { MobileMenuDrawer } from "@/components/navigation/MobileMenuDrawer";
import { PUBLIC_NAV_ITEMS } from "@/config/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  function handleSectionClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      } else if (targetId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setMobileOpen(false);
    } else {
      setMobileOpen(false);
    }
  }

  const isSubPage = pathname !== "/";

  return (
    <header
      className="landing-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--topbar-bg, #072a1e)",
        borderBottom: "1px solid var(--line, rgba(255,255,255,0.12))",
        boxShadow: isScrolled ? "0 8px 30px rgba(0,0,0,0.25)" : "none",
        transition: "box-shadow 0.2s ease, background 0.2s ease",
        padding: "0.75rem 1rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
        <Logo />

        {/* Desktop Navigation Links */}
        {!isSubPage && (
          <nav style={{ display: "flex", gap: "1.25rem", alignItems: "center" }} aria-label="Public desktop navigation" className="desktop-nav-links">
            {PUBLIC_NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleSectionClick(e, href)}
                className="link-text"
                style={{ fontSize: "0.88rem", fontWeight: 600, minHeight: "44px", display: "inline-flex", alignItems: "center" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Action Controls + Always Visible Back Button */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {isSubPage ? (
            <HeaderBackButton />
          ) : (
            <div className="landing-actions" style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              {isAuthenticated ? (
                <Link href="/dashboard" className="button button-primary button-small" style={{ minHeight: "42px" }}>
                  Open Dashboard <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link href="/login" className="button button-ghost button-small" style={{ minHeight: "42px" }}>
                    Sign in
                  </Link>
                  <Link href="/signup" className="button button-primary button-small" style={{ minHeight: "42px" }}>
                    Get started <Sparkles size={15} />
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Hamburger Button on Main Landing Page */}
          {!isSubPage && (
            <button
              type="button"
              className="icon-button menu-button mobile-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="public-mobile-drawer"
              aria-label="Open navigation menu"
              style={{ minHeight: "44px", minWidth: "44px", color: "#fff" }}
            >
              <Menu size={22} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {!isSubPage && (
        <MobileMenuDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} title="Navigation Menu">
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }} aria-label="Public mobile navigation" id="public-mobile-drawer">
            {PUBLIC_NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleSectionClick(e, href)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.85rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#fff",
                  background: "rgba(255,255,255,0.05)",
                  minHeight: "48px",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            ))}

            <div style={{ height: "1px", background: "rgba(255,255,255,0.12)", margin: "0.75rem 0" }} />

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="button button-primary button-full"
                style={{ minHeight: "48px", fontSize: "0.95rem" }}
              >
                Open Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="button button-soft button-full"
                  style={{ minHeight: "48px", fontSize: "0.95rem" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="button button-primary button-full"
                  style={{ minHeight: "48px", fontSize: "0.95rem" }}
                >
                  Get started <Sparkles size={16} />
                </Link>
              </div>
            )}
          </nav>
        </MobileMenuDrawer>
      )}
    </header>
  );
}
