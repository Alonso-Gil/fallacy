import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";

let browserClient: SupabaseClient | null = null;

/**
 * Cliente browser para Supabase. Devuelve `null` si no hay proyecto configurado (`config/supabase`).
 */
export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      getSupabasePublicKey()!
    );
  }
  return browserClient;
}
