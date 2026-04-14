import { redirect } from "next/navigation";
import React from "react";

import Login from "components/auth/Login/Login";
import RandomFallacy from "components/RandomFallacy/RandomFallacy";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/server-props";

export default async function SignInPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      redirect("/");
    }
  }

  return (
    <div className="Login flex flex-1">
      <div className="animate-fade-in hidden flex-1 items-center justify-center md:w-1/2 xl:flex">
        <RandomFallacy />
      </div>
      <Login className="animate-fade-in-right-to-left dark:border-border-color border-r" />
    </div>
  );
}
