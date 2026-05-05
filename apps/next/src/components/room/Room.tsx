import React from "react";

import { Separator } from "ui/shadcnComponents/separator";
import BrandHeader from "components/home/BrandHeader/BrandHeader";
import LobbyUsersPanel from "components/home/LobbyUsersPanel/LobbyUsersPanel";
import UserPanel from "components/UserPanel/UserPanel";
import type { RoomProps as Props } from "./Room.types";

const Room: React.FC<Props> = props => {
  const { roomId } = props;

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <h1 className="sr-only">Sala de debate</h1>
      <div className="flex h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden">
        <aside
          aria-label="Sidebar de la sala"
          className="flex h-full min-h-0 w-64 min-w-0 shrink-0 flex-col border-r md:w-72"
        >
          <BrandHeader />
          <Separator variant="fade" />
          <LobbyUsersPanel className="min-h-0 flex-1" />
          <Separator variant="fade" />
          <UserPanel />
        </aside>
        <section
          className="bg-lobby-canvas flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
          aria-label="Contenido de la sala"
        >
          <div className="flex min-h-0 flex-1 items-center justify-center p-6">
            <div className="border-border/50 bg-card/80 rounded-2xl border px-6 py-5 text-center shadow-sm">
              <h2 className="text-foreground text-lg font-semibold">
                Sala de debate
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">{roomId}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Room;
