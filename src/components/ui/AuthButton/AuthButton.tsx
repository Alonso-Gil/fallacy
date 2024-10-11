"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { AuthButtonProps as Props } from "./AuthButton.types";
import Button from "../Button/Button";

const AuthButton: React.FC<Props> = (props) => {
  const { signInProvider, signInIcon, className } = props;
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    if (!signInProvider) return;

    await supabase.auth.signInWithOAuth({
      provider: signInProvider,
      options: {
        redirectTo: "http://localhost:3000/api/auth/callback",
      },
    });
  };

  return (
    <Button
      text={`Sign in with ${signInProvider}`}
      type="button"
      onClick={handleSignIn}
      icon={signInIcon}
      className={className}
    />
  );
};

export default AuthButton;
