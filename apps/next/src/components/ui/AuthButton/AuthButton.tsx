"use client";
import { routing } from "i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

import Button from "ui/Button/Button";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/component";
import { cn } from "lib/utils";
import { AuthButtonProps as Props } from "./AuthButton.types";

const AuthButton: React.FC<Props> = props => {
  const { signInProvider, signInIcon, className } = props;
  const authAvailable = isSupabaseConfigured();
  const locale = useLocale();
  const t = useTranslations("Auth.oauth");

  const handleSignIn = async () => {
    if (!signInProvider) return;
    if (globalThis.window === undefined) {
      return;
    }

    if (!authAvailable) {
      return;
    }

    const supabase = createClient()!;

    const origin = globalThis.window.location.origin;
    const nextPath = locale === routing.defaultLocale ? "/" : `/${locale}`;

    await supabase.auth.signInWithOAuth({
      provider: signInProvider,
      options: {
        redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`
      }
    });
  };

  const providerLabelById: Record<typeof signInProvider, string> = {
    google: "Google"
  };
  const providerLabel = providerLabelById[signInProvider];

  return (
    <Button
      text={
        authAvailable
          ? t("signIn", { provider: providerLabel })
          : t("signInDisabled", { provider: providerLabel })
      }
      type="button"
      isDisabled={!authAvailable}
      title={authAvailable ? undefined : t("configureSupabase")}
      onClick={() => void handleSignIn()}
      icon={signInIcon}
      className={cn(
        "border-border bg-surface-secondary text-foreground focus-visible:ring-primary/40 h-12 w-full border text-base font-medium",
        "transition-[background-color,border-color,filter,box-shadow] duration-200 ease-out",
        "hover:bg-surface hover:border-border hover:shadow-sm",
        "dark:hover:bg-surface-secondary! dark:hover:border-white/15 dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] dark:hover:brightness-110",
        className
      )}
    />
  );
};

export default AuthButton;
