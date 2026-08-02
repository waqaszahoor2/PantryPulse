import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ confirmation: z.literal("DELETE") });
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = attempts.get(ip);
  if (!existing || existing.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  existing.count += 1;
  return existing.count > 3;
}

export async function DELETE(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Origin check failed." }, { status: 403 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many deletion attempts. Try again later." }, { status: 429 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid confirmation." }, { status: 400 });

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return NextResponse.json({ error: "Server deletion credentials are not configured." }, { status: 503 });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error: userError } = await admin.auth.getUser(token);
  if (userError || !user) return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Account deletion failed." }, { status: 500 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
