import Home from "components/home/Home/Home";
import { getCurrentUser } from "utils/supabase/getCurrentUser";
import { buildPageMetadata } from "lib/site";

import type { Metadata } from "next";

export const generateMetadata = async ({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/",
    titleKey: "home.title",
    descriptionKey: "home.description",
    absoluteTitle: true
  });
};

const HomePage = async () => {
  const { user } = await getCurrentUser();
  return <Home initialUser={user} />;
};

export default HomePage;
