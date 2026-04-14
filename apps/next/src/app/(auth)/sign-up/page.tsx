import { redirect } from "next/navigation";
import React from "react";

import SignUp from "components/auth/SignUp/SignUp";
import RandomFallacy from "components/RandomFallacy/RandomFallacy";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/server-props";

export default async function SignUpPage() {
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
    <div className="SignUpPage flex flex-1">
      <SignUp className="animate-fade-in-right-to-left dark:border-border-color border-r" />
      <div className="animate-fade-in hidden flex-1 items-center justify-center md:w-1/2 xl:flex">
        <RandomFallacy />
      </div>
    </div>
  );
}
