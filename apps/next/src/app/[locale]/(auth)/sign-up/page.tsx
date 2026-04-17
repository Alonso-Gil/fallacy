import { redirect } from "next/navigation";
import React from "react";

import SignUp from "components/auth/SignUp/SignUp";
import RandomFallacy from "components/RandomFallacy/RandomFallacy";
import { Separator } from "components/ui/separator";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/server-props";

const SignUpPage = async () => {
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
    <div className="SignUpPage bg-background flex flex-1">
      <SignUp className="animate-fade-in-right-to-left flex-1" />
      <Separator
        orientation="vertical"
        className="bg-border hidden self-stretch xl:block"
      />
      <div className="animate-fade-in hidden flex-1 items-center justify-center md:w-1/2 xl:flex">
        <RandomFallacy />
      </div>
    </div>
  );
};

export default SignUpPage;
