import { redirect } from "next/navigation";

import Main from "components/Main/Main";
import Page from "components/Page/Page";
import { isSupabaseConfigured } from "config/supabase";
import { createClient } from "utils/supabase/server-props";

import type { ReactNode } from "react";

export default async function HomeLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
    if (error || !user) {
      redirect("/login");
    }
  }

  return (
    <Page>
      <Main>{children}</Main>
    </Page>
  );
}
