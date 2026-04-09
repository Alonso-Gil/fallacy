/**
 * TODO(Supabase): Cliente server para Pages Router (`NextApiRequest`/`NextApiResponse`).
 * No se usa en la App Router actual; conservar al migrar rutas legacy o borrar si ya no aplica.
 */
import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";
import { type NextApiRequest, type NextApiResponse } from "next";

export default function createClient(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "[TODO Supabase] Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o ANON_KEY legacy)"
    );
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey()!,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map(name => ({
            name,
            value: req.cookies[name] || ""
          }));
        },
        setAll(cookiesToSet) {
          res.setHeader(
            "Set-Cookie",
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options)
            )
          );
        }
      }
    }
  );

  return supabase;
}
