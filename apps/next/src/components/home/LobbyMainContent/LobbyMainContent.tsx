"use client";

import { useTranslations } from "next-intl";
import React, { useId } from "react";

import type { LobbyMainContentProps as Props } from "./LobbyMainContent.types";
import LobbySearchBar from "./LobbySearchBar/LobbySearchBar";

const MOCK_PLACEHOLDERS = [
  "p-a",
  "p-b",
  "p-c",
  "p-d",
  "p-e",
  "p-f",
  "p-g",
  "p-h",
  "p-i",
  "p-j"
] as const;

const LobbyMainContent: React.FC<Props> = props => {
  const { className } = props;
  const t = useTranslations("Lobby");
  const searchInputId = `lobby-search-${useId()}`;

  return (
    <section className={className} aria-label={t("lobbyContentRegion")}>
      <div className="border-border/20 shrink-0 border-b px-4 py-4 sm:px-6 sm:py-4">
        <LobbySearchBar
          className="mx-auto w-full max-w-2xl min-w-0"
          inputId={searchInputId}
          label={t("searchBarLabel")}
          placeholder={t("searchPlaceholder")}
        />
      </div>
      <div className="grid min-h-0 w-full min-w-0 flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(min(100%,28rem),1fr))] content-start gap-4 overflow-y-auto overscroll-y-contain p-4">
        {MOCK_PLACEHOLDERS.map(id => (
          <div
            key={id}
            className="dark:bg-foreground/4 border-border/40 bg-foreground/5 min-h-60 w-full max-w-full min-w-0 rounded-xl border border-dashed"
          />
        ))}
      </div>
    </section>
  );
};

export default LobbyMainContent;
