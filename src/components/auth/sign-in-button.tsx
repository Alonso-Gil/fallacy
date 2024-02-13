"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import GitHubIcon from "images/icons/github-icon.svg";

const SignInButton = () => {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/api/auth/callback",
      },
    });
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const { session } = data;
      setSession(session);
    };

    getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      className="mb-2 me-2 inline-flex items-center justify-center gap-3 rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500"
      onClick={handleSignIn}
    >
      <GitHubIcon className="h-6 w-6" />
      Sign in with Github
    </button>
  );
};

export default SignInButton;
