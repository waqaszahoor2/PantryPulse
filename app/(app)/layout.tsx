import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PantryProvider } from "@/lib/data/provider";
import { createClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_DATA_MODE === "supabase" && isSupabaseServerConfigured()) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
  }
  return <PantryProvider><AppShell>{children}</AppShell></PantryProvider>;
}
