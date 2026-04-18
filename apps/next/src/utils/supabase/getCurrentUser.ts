import { User } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "./server-props";

export type CurrentUser =
  | { status: "authenticated"; user: User }
  | { status: "anonymous"; user: null };

export const getCurrentUser = async (): Promise<CurrentUser> => {
  if (!isSupabaseConfigured()) {
    return { status: "anonymous", user: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { status: "anonymous", user: null };
  }

  return { status: "authenticated", user };
};
