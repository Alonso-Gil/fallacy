import { type SetAllCookies } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";
import { applySupabaseCookies } from "utils/supabase/applySupabaseCookies";
import { routing } from "i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  if (!isSupabaseConfigured()) {
    return response;
  }

  const hasSupabaseSessionCookie = request.cookies
    .getAll()
    .some(cookie => cookie.name.startsWith("sb-"));

  if (!hasSupabaseSessionCookie) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey()!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Parameters<SetAllCookies>[0],
          headers?: Parameters<SetAllCookies>[1]
        ) {
          applySupabaseCookies(response, cookiesToSet, headers);
        }
      }
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"]
};
