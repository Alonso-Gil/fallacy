// import { redirect } from "next/navigation";
// import { createClient } from "utils/supabase/server-props";

import Home from "components/home/Home/Home";
import Main from "components/Main/Main";
import Page from "components/Page/Page";

export default function HomePage() {
  // const supabase = createClient();

  // const { data, error } = await supabase.auth.getUser();

  // if (error || !data) {
  //   redirect("/login");
  // }

  return (
    <Page>
      <Main>
        <Home />
      </Main>
    </Page>
  );
}
