import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LogOutButton from "@/components/auth/LogOutButton";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: sessionData } = await supabase.auth.getSession();
  const { session } = sessionData;

  if (!session) {
    redirect("/login");
  }

  return <main className="">{session && <LogOutButton />}</main>;
}
