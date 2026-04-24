import React from "react";

import { Separator } from "ui/shadcnComponents/separator";
import BrandHeader from "components/home/BrandHeader/BrandHeader";
import LobbyMainContent from "components/home/LobbyMainContent/LobbyMainContent";
import LobbyUsersPanel from "components/home/LobbyUsersPanel/LobbyUsersPanel";
import UserPanel from "components/UserPanel/UserPanel";
import { HomeProps as Props } from "./Home.types";

const Home: React.FC<Props> = () => {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <h1 className="sr-only">Lobby</h1>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden">
        <aside
          aria-label="Sidebar del lobby"
          className="flex h-full min-h-0 w-64 min-w-0 shrink-0 flex-col border-r md:w-72"
        >
          <BrandHeader />
          <Separator variant="fade" />
          <LobbyUsersPanel className="min-h-0 flex-1" />
          <Separator variant="fade" />
          <UserPanel />
        </aside>
        <LobbyMainContent className="bg-lobby-canvas flex min-h-0 w-full max-w-full min-w-0 flex-1 flex-col overflow-hidden" />
      </div>
    </main>
  );
};

export default Home;
