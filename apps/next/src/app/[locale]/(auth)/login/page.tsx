import { redirect } from "next/navigation";
import React from "react";

import Login from "components/auth/Login/Login";
import RandomFallacy from "components/RandomFallacy/RandomFallacy";
import { Separator } from "components/ui/separator";
import { getCurrentUser } from "utils/supabase/getCurrentUser";
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
    path: "/login",
    titleKey: "login.title",
    descriptionKey: "login.description"
  });
};

const SignInPage = async ({
  params
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  const { status } = await getCurrentUser();
  if (status === "authenticated") {
    redirect(localePath(locale, "/"));
  }

  return (
    <div className="Login flex flex-1">
      <div className="login-side-glow animate-fade-in relative hidden flex-1 items-center justify-center overflow-hidden md:w-1/2 xl:flex">
        <RandomFallacy />
      </div>
      <Separator
        orientation="vertical"
        className="bg-border hidden self-stretch xl:block"
      />
      <div className="bg-surface flex flex-1 flex-col">
        <Login className="animate-fade-in-right-to-left" />
      </div>
    </div>
  );
};

export default SignInPage;
