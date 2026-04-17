import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";

const authCallback = async (request: NextRequest) => {
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/login?reason=supabase-disabled", request.url)
    );
  }

  const url = new URL(request.url);
  let code = url.searchParams.get("code");
  let nextParam = url.searchParams.get("next") ?? "/";

  if (!code && request.method === "POST") {
    const formData = await request.formData();
    const fromForm = formData.get("code");
    code = typeof fromForm === "string" ? fromForm : null;
    const nextFromForm = formData.get("next");
    if (typeof nextFromForm === "string" && nextFromForm.startsWith("/")) {
      nextParam = nextFromForm;
    }
  }

  const next = nextParam.startsWith("/") ? nextParam : "/";

  if (code) {
    const response = NextResponse.redirect(`${url.origin}${next}`);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      getSupabasePublicKey()!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
            for (const { name, value, options } of cookiesToSet) {
              if (options) {
                response.cookies.set(name, value, options);
              } else {
                response.cookies.set(name, value);
              }
            }
          }
        }
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
  }

  return NextResponse.redirect(`${url.origin}/login?reason=oauth`);
};

export const GET = async (request: NextRequest) => authCallback(request);

export const POST = async (request: NextRequest) => authCallback(request);
