import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function EmptyState({ icon: Icon, title, description, action, href }: { icon: LucideIcon; title: string; description: string; action?: string; href?: string }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon size={26} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && href && <Link className="button button-primary" href={href}>{action}</Link>}
    </div>
  );
}
