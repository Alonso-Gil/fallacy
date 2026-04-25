import { createClient } from "utils/supabase/component";

export type AccessTokenResult =
  | { status: "ok"; accessToken: string }
  | { status: "api_not_configured" }
  | { status: "unauthenticated" };

export const getClientAccessToken = async (): Promise<AccessTokenResult> => {
  const supabase = createClient();
  if (!supabase) {
    return { status: "api_not_configured" };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) {
    return { status: "unauthenticated" };
  }

  return { status: "ok", accessToken: data.session.access_token };
};
