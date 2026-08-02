import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "We could not load your data",
  description = "Please check your network connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="panel"
      style={{
        borderRadius: "20px",
        padding: "2.5rem 1.5rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        background: "var(--surface)",
        border: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "rgba(224,69,69,0.12)",
          color: "var(--red)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <AlertTriangle size={28} />
      </div>
      <div style={{ maxWidth: "420px" }}>
        <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.25rem", color: "var(--text)" }}>{title}</h3>
        <p className="muted" style={{ margin: 0, fontSize: "0.88rem", lineHeight: "1.5" }}>
          {description}
        </p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="button button-soft button-small"
          style={{ gap: "0.4rem", marginTop: "0.5rem" }}
        >
          <RotateCcw size={16} /> Retry
        </button>
      )}
    </div>
  );
}
