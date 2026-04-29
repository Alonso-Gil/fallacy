import { createClient as createClientPrimitive } from "@supabase/supabase-js";

import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";

export const createClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error("Service unavailable");
  }

  const supabase = createClientPrimitive(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey()!
  );

  return supabase;
};
