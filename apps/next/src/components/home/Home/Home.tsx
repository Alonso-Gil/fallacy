import React from "react";

import { Separator } from "ui/separator";
import BrandHeader from "components/home/BrandHeader/BrandHeader";
import LobbyUsersPanel from "components/home/LobbyUsersPanel/LobbyUsersPanel";
import UserPanel from "components/UserPanel/UserPanel";
import { HomeProps as Props } from "./Home.types";

const Home: React.FC<Props> = props => {
  const { initialUser } = props;

  return (
    <main className="flex flex-1 flex-col">
      <h1 className="sr-only">Lobby</h1>
      <div className="flex h-full w-full">
        <aside
          aria-label="Usuarios y panel del usuario"
          className="hidden min-w-72 flex-1 flex-col md:flex"
        >
          <BrandHeader />
          <Separator variant="fade" />
          <LobbyUsersPanel />
          <Separator variant="fade" />
          <UserPanel initialUser={initialUser} />
        </aside>
        <Separator orientation="vertical" className="hidden md:block" />
        <section
          aria-labelledby="lobby-info-title"
          className="bg-surface flex w-full flex-col items-center justify-center"
        >
          <h2 id="lobby-info-title" className="sr-only">
            Información del lobby
          </h2>
          Lobby info
        </section>
      </div>
    </main>
  );
};

export default Home;
