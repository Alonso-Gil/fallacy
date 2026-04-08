import { createServerClient } from "@supabase/ssr";
import { type EmailOtpType } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "config/supabase";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO(Supabase): Verificación OTP por email — requiere proyecto y tablas/auth
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/login?reason=supabase-disabled", request.url)
    );
  }

  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  if (token_hash && type) {
    const nextParam = url.searchParams.get("next");
    const successPath =
      nextParam && nextParam.startsWith("/") ? nextParam : "/";

    const response = NextResponse.redirect(`${url.origin}${successPath}`);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              if (options) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- opciones de cookie de Supabase
                response.cookies.set(name, value, options);
              } else {
                response.cookies.set(name, value);
              }
            }
          }
        }
      }
    );

    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash
    });

    if (!error) {
      return response;
    }
    console.error(error);
  }

  return NextResponse.redirect(`${url.origin}/error`);
}
