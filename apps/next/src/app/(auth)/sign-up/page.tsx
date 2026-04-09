import { isSupabaseConfigured } from "config/supabase";
import { redirect } from "next/navigation";
import React from "react";
import { createClient } from "utils/supabase/server-props";

import SignUp from "components/auth/SignUp/SignUp";
import RandomFallacy from "components/RandomFallacy/RandomFallacy";

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
      <SignUp className="animate-fade-in-right-to-left border-r dark:border-border-color" />
      <div className="hidden flex-1 animate-fade-in items-center justify-center md:w-1/2 xl:flex">
        <RandomFallacy />
      </div>
    </div>
  );
}
