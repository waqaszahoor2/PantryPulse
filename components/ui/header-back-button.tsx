"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface HeaderBackButtonProps {
  fallbackUrl?: string;
  fallbackText?: string;
}

export function HeaderBackButton({ fallbackUrl, fallbackText }: HeaderBackButtonProps) {
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

  const href = isAuthenticated ? "/dashboard" : (fallbackUrl || "/");
  const label = isAuthenticated ? "Back to dashboard" : (fallbackText || "Back to home");

  return (
    <Link
      href={href}
      className="button button-ghost button-small header-back-button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        borderRadius: "999px",
        padding: "0.4rem 0.85rem",
        border: "1px solid var(--line, rgba(255,255,255,0.25))",
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "var(--text, #ffffff)",
        textDecoration: "none",
        whiteSpace: "nowrap",
        minHeight: "38px",
        flexShrink: 0,
      }}
    >
      <ArrowLeft size={16} />
      <span>{label}</span>
    </Link>
  );
}
