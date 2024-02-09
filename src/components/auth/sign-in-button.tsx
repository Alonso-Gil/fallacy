"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

import GitHubIcon from "images/icons/github-icon.svg";

const SignInButton = () => {
  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  console.log({ session });

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
      className="gap-3 justify-center text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
      onClick={handleSignIn}
    >
      <GitHubIcon className="w-6 h-6" />
      Sign in with Github
    </button>
  );
};

export default SignInButton;
