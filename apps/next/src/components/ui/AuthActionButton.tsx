"use client";
import { useRouter } from "i18n/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import { createClient } from "utils/supabase/component";
import { useAuthStore } from "store/auth/auth.store";

const AuthActionButton = () => {
  const router = useRouter();
  const t = useTranslations("Auth");
  const user = useAuthStore(state => state.user);
  const reset = useAuthStore(state => state.reset);

  const isAuthenticated = user !== null;

  const handleSignOut = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    reset();
    router.refresh();
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  return (
    <button
      type="button"
      className="me-2 mb-2 inline-flex items-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:ring-4 focus:ring-[#24292F]/50 focus:outline-none dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500"
      onClick={() => {
        if (isAuthenticated) {
          void handleSignOut();
          return;
        }
        handleSignIn();
      }}
    >
      {isAuthenticated ? t("logOut") : t("signIn")}
    </button>
  );
};

export default AuthActionButton;
