import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function PublicPageContainer({ children, className = "", style }: ContainerProps) {
  return (
    <div
      className={`w-full mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ${className}`}
      style={{ minHeight: "calc(100vh - 70px)", ...style }}
    >
      {children}
    </div>
  );
}

export function AppPageContainer({ children, className = "", style }: ContainerProps) {
  return (
    <div
      className={`w-full mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-[calc(96px+env(safe-area-inset-bottom))] lg:pb-12 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function PageHeader({ children, className = "", style }: ContainerProps) {
  return (
    <header className={`page-heading-row mb-6 lg:mb-8 ${className}`} style={style}>
      {children}
    </header>
  );
}

export function PageSection({ children, className = "", style }: ContainerProps) {
  return (
    <section className={`mb-6 lg:mb-8 ${className}`} style={style}>
      {children}
    </section>
  );
}

export function ContentCard({ children, className = "", style }: ContainerProps) {
  return (
    <div
      className={`panel ${className}`}
      style={{
        borderRadius: "20px",
        padding: "1.25rem",
        border: "1px solid var(--line)",
        background: "var(--surface)",
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function MobilePageActions({ children, className = "", style }: ContainerProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 my-4 sm:my-0 ${className}`} style={style}>
      {children}
    </div>
  );
}
