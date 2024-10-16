import Main from "@/components/Main/Main";
import Page from "@/components/Page/Page";
import Home from "@/components/home/Home/Home";

export default async function HomePage() {
  return (
    <Page>
      <Main>
        <Home />
      </Main>
    </Page>
  );
}
