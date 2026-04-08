import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "./src/config/supabase";

export async function middleware(req: NextRequest) {
  // TODO(Supabase): Refrescar sesión con cookies cuando el proyecto esté de nuevo en Supabase.
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"]
};
