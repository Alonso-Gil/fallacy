"use client";
import { useRouter } from "i18n/navigation";
import { LogIn, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Button } from "components/ui/button";
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
    <Button
      type="button"
      variant="default"
      size="lg"
      className="hover:bg-primary-hover shadow-primary/25 hover:shadow-primary/35 w-full shadow-md transition-shadow"
      onClick={() => {
        if (isAuthenticated) {
          void handleSignOut();
          return;
        }
        handleSignIn();
      }}
    >
      {isAuthenticated ? (
        <LogOut data-icon="inline-start" />
      ) : (
        <LogIn data-icon="inline-start" />
      )}
      {isAuthenticated ? t("logOut") : t("signIn")}
    </Button>
  );
};

export default AuthActionButton;
