"use client";
import { createClient } from "utils/supabase/component";
import { useAuthStore } from "store/auth/auth.store";
import { useRouter } from "i18n/navigation";

export const useSignOut = () => {
  const router = useRouter();
  const reset = useAuthStore(state => state.reset);

  return async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    reset();
    router.push("/login");
    router.refresh();
  };
};
