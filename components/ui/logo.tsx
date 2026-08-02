import { Leaf } from "lucide-react";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/dashboard" className="brand" aria-label="PantryPulse home">
      <span className="brand-mark"><Leaf size={19} strokeWidth={2.5} /></span>
      {!compact && <span>PantryPulse</span>}
    </Link>
  );
}
