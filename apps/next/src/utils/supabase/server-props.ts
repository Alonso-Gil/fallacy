import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para Server Components / server actions (cookies de sesión).
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase no está configurado (NEXT_PUBLIC_SUPABASE_URL y clave pública)"
    );
  }

  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = getSupabasePublicKey()!;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // set puede fallar en Server Components; el middleware renueva la sesión
        }
      }
    }
  });
}
