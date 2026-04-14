"use client";
import React from "react";
import { twMerge } from "tailwind-merge";

import Button from "ui/Button/Button";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/component";
import { AuthButtonProps as Props } from "./AuthButton.types";

const AuthButton: React.FC<Props> = props => {
  const { signInProvider, signInIcon, className } = props;
  const authAvailable = isSupabaseConfigured();

  const handleSignIn = async () => {
    if (!signInProvider) return;
    if (typeof window === "undefined") return;

    if (!authAvailable) {
      console.warn(
        "[Auth] OAuth desactivado: configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
      );
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    const origin = window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: signInProvider,
      options: {
        redirectTo: `${origin}/api/auth/callback?next=/`
      }
    });
  };

  return (
    <Button
      text={
        authAvailable
          ? `Sign in with ${signInProvider}`
          : `Sign in with ${signInProvider} (Supabase desactivado)`
      }
      type="button"
      isDisabled={!authAvailable}
      title={
        authAvailable
          ? undefined
          : "Configura Supabase en .env para habilitar OAuth"
      }
      onClick={() => void handleSignIn()}
      icon={signInIcon}
      className={twMerge(
        "bg-[#24292F] text-white dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500",
        className
      )}
    />
  );
};

export default AuthButton;
