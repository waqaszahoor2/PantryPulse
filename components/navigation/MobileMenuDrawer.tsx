"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function MobileMenuDrawer({ isOpen, onClose, title = "Navigation Menu", children }: MobileMenuDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll while menu is open
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="scrim"
        onClick={onClose}
        aria-label="Close navigation backdrop"
        style={{ zIndex: 999 }}
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sidebar sidebar-open"
        style={{
          zIndex: 1000,
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          width: "min(320px, 85vw)",
          background: "var(--sidebar-bg, #072a1e)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "16px 0 50px rgba(0,0,0,0.35)",
        }}
      >
        <div className="sidebar-head" style={{ padding: "1.1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo />
          <button
            type="button"
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close navigation menu"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-body" style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {children}
        </div>
      </div>
    </>
  );
}
