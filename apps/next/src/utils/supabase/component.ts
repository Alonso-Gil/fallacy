import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "config/supabase";

let browserClient: SupabaseClient | null = null;

/**
 * Cliente browser para Supabase. Devuelve `null` si no hay proyecto configurado (ver `config/supabase`).
 * TODO(Supabase): Los callers deben comprobar `null` o usar solo cuando `isSupabaseConfigured()` sea true.
 */
export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}
