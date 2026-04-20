import { redirect } from "next/navigation";

import SignUp from "components/auth/SignUp/SignUp";
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
  const { status } = await getCurrentUser();

  if (status === "authenticated") {
    redirect(localePath(locale, "/"));
  }

  return <SignUp />;
};

export default SignUpPage;
