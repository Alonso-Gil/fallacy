import { useTranslations } from "next-intl";
import React from "react";

import { cn } from "lib/utils";
import { LobbyUsersPanelProps as Props } from "./LobbyUsersPanel.types";

const LobbyUsersPanel: React.FC<Props> = ({ className }) => {
  const t = useTranslations("Lobby");

  return (
    <section
      aria-labelledby="lobby-users-title"
      className={cn(
        className,
        "bg-background/30 flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-1.5 overflow-y-auto px-4 py-5"
      )}
    >
      <h2
        id="lobby-users-title"
        className="text-text-secondary/70 text-[0.65rem] font-semibold tracking-[0.18em] uppercase"
      >
        {t("users.label")}
      </h2>
      <span className="text-text text-4xl font-semibold tabular-nums">0</span>
      <span className="text-text-secondary text-center text-xs">
        {t("users.empty")}
      </span>
    </section>
  );
};

export default LobbyUsersPanel;
