import { type SetAllCookies } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import { routing } from "i18n/routing";
import { type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";

const handleI18nRouting = createIntlMiddleware(routing);

const proxy = async (request: NextRequest) => {
  const response = handleI18nRouting(request);

  if (!isSupabaseConfigured()) {
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
          cookiesToSet.forEach(({ name, value, options }) => {
            if (options) {
              response.cookies.set(name, value, options);
            } else {
              response.cookies.set(name, value);
            }
          });
          if (headers && typeof headers === "object") {
            Object.entries(headers).forEach(([key, value]) => {
              if (typeof value === "string") {
                response.headers.set(key, value);
              }
            });
          }
        }
      }
    }
  );

  await supabase.auth.getUser();

  return response;
};

export default proxy;

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"]
};
