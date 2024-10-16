import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { HomeProps as Props } from "./Home.types";

const Home: React.FC<Props> = async () => {
  const supabase = createServerComponentClient({ cookies });
  const { data: sessionData } = await supabase.auth.getSession();
  const { session } = sessionData;

  if (!session) redirect("/login");

  return <div className="flex h-full w-full bg-red-500"></div>;
};

export default Home;
