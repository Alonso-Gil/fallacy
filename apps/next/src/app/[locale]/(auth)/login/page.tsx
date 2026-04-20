import { redirect } from "next/navigation";

import Login from "components/auth/Login/Login";
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

const LoginPage = async ({
  params
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const { status } = await getCurrentUser();

  if (status === "authenticated") {
    redirect(localePath(locale, "/"));
  }

  return <Login />;
};

export default LoginPage;
