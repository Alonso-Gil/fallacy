import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import { type NextApiRequest, type NextApiResponse } from "next";

import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";

const createClient = (req: NextApiRequest, res: NextApiResponse) => {
  if (!isSupabaseConfigured()) {
    throw new Error("Service unavailable");
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
};

export default createClient;
