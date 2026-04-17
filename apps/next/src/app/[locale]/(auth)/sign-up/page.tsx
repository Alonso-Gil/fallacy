import { redirect } from "next/navigation";
import React from "react";

import SignUp from "components/auth/SignUp/SignUp";
import RandomFallacy from "components/RandomFallacy/RandomFallacy";
import { Separator } from "components/ui/separator";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/server-props";
import { buildPageMetadata, localePath } from "lib/site";

import type { Metadata } from "next";

export const generateMetadata = async ({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/sign-up",
    titleKey: "signUp.title",
    descriptionKey: "signUp.description"
  });
};

const SignUpPage = async ({
  params
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) {
      redirect(localePath(locale, "/"));
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
