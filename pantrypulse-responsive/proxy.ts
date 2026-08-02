import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  return createClient(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon-192.png|icon-512.png|manifest.webmanifest|sw.js).*)",
  ],
};
