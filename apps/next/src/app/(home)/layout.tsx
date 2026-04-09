import { isSupabaseConfigured } from "config/supabase";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "utils/supabase/server-props";

import Main from "components/Main/Main";
import Page from "components/Page/Page";

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
