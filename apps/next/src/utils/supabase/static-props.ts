/**
 * TODO(Supabase): Cliente sin cookies (getStaticProps / datos públicos).
 * Reconectar cuando tengas proyecto y políticas RLS definidas.
 */
import { createClient as createClientPrimitive } from "@supabase/supabase-js";
import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "[TODO Supabase] Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o ANON_KEY legacy)"
    );
  }

  const supabase = createClientPrimitive(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey()!
  );

  return supabase;
}
