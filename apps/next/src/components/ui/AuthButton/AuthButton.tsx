"use client";
import { twMerge } from "tailwind-merge";

import { AuthButtonProps as Props } from "./AuthButton.types";
import Button from "../Button/Button";
import { createClient } from "@/utils/supabase/component";

const AuthButton: React.FC<Props> = (props) => {
  const { signInProvider, signInIcon, className } = props;
  const supabase = createClient();

  const handleSignIn = async () => {
    if (!signInProvider) return;

    await supabase.auth.signInWithOAuth({
      provider: signInProvider,
      options: {
        // TODO: cambiar url
        redirectTo: "http://localhost:3000/api/auth/callback?next=/",
      },
    });
  };

  return (
    <Button
      text={`Sign in with ${signInProvider}`}
      type="button"
      onClick={handleSignIn}
      icon={signInIcon}
      className={twMerge(
        "bg-[#24292F] text-white dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500",
        className,
      )}
    />
  );
};

export default AuthButton;
