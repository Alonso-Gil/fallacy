import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";
import { type NextRequest, NextResponse } from "next/server";

async function authCallback(request: NextRequest) {
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

  return NextResponse.redirect(`${url.origin}/auth/auth-code-error`);
}

export async function GET(request: NextRequest) {
  return authCallback(request);
}

export async function POST(request: NextRequest) {
  return authCallback(request);
}
