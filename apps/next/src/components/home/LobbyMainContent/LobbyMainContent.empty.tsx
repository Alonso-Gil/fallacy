import { MessageSquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import CreateRoomDialog from "./CreateRoomDialog/CreateRoomDialog";

const LobbyMainContentEmpty: React.FC = () => {
  const t = useTranslations("Lobby");

  return (
    <div className="mx-auto flex min-h-full w-full max-w-384 items-center justify-center">
      <div className="border-border/60 bg-card/90 flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border px-6 py-10 text-center shadow-sm backdrop-blur-sm">
        <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
          <MessageSquarePlus className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-foreground text-lg font-semibold">
            {t("room.feedback.emptyTitle")}
          </h2>
          <p className="text-muted-foreground text-sm">
            {t("room.feedback.empty")}
          </p>
        </div>
        <CreateRoomDialog className="shadow-primary/15 hover:shadow-primary/25 h-11 w-full rounded-xl px-5 text-sm font-semibold shadow-lg transition-all sm:w-auto sm:min-w-36" />
      </div>
    </div>
  );
};

export default LobbyMainContentEmpty;
