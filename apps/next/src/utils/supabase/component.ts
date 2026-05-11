import { createBrowserClient } from "@supabase/ssr";
import {
  createClient as createSupabaseClient,
  type SupabaseClient
} from "@supabase/supabase-js";

import { getSupabasePublicKey, isSupabaseConfigured } from "config/supabase";

let browserClient: SupabaseClient | null = null;
let realtimeClient: SupabaseClient | null = null;

export const createClient = (): SupabaseClient | null => {
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
};

export const createRealtimeClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!realtimeClient) {
    realtimeClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      getSupabasePublicKey()!
    );
  }
  return realtimeClient;
};
