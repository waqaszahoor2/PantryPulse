import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading your pantry…" }: LoadingStateProps) {
  return (
    <div
      className="panel"
      style={{
        borderRadius: "20px",
        padding: "3rem 1.5rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.85rem",
        background: "var(--surface)",
        border: "1px solid var(--line)",
      }}
    >
      <Loader2 size={32} className="spin" style={{ color: "var(--primary)" }} />
      <p className="muted" style={{ margin: 0, fontSize: "0.9rem", fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}
