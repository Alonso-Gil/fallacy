"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useId } from "react";
import { toast } from "sonner";

import { cn } from "lib/utils";
import { isRoomApiConfigured } from "services/room/room.service";
import { useFetchLobbyRooms } from "services/room/room.service.hooks";
import CreateRoomDialog from "./CreateRoomDialog/CreateRoomDialog";
import type { LobbyMainContentProps as Props } from "./LobbyMainContent.types";
import LobbySearchBar from "./LobbySearchBar/LobbySearchBar";

const LobbyMainContent: React.FC<Props> = props => {
  const { className } = props;
  const t = useTranslations("Lobby");
  const searchInputId = `lobby-search-${useId()}`;
  const isRoomApiReady = isRoomApiConfigured();
  const {
    data: rooms = [],
    isLoading: isLoadingRooms,
    isError: isRoomsError
  } = useFetchLobbyRooms({ isEnabled: isRoomApiReady });

  useEffect(() => {
    if (!isRoomsError) {
      return;
    }
    toast.error(t("room.errors.roomsLoad"));
  }, [isRoomsError, t]);

  return (
    <section
      className={cn("relative isolate overflow-hidden", className)}
      aria-label={t("lobbyContentRegion")}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_85%_at_50%_-5%,oklch(0.75_0.14_45/0.11),transparent_58%),radial-gradient(ellipse_55%_45%_at_92%_45%,oklch(0.55_0.14_300/0.07),transparent_52%),radial-gradient(ellipse_40%_35%_at_12%_75%,oklch(0.5_0.12_300/0.05),transparent_50%)] dark:bg-[radial-gradient(ellipse_100%_85%_at_50%_-5%,oklch(0.6_0.14_45/0.14),transparent_58%),radial-gradient(ellipse_55%_45%_at_92%_45%,oklch(0.5_0.15_300/0.1),transparent_52%),radial-gradient(ellipse_40%_35%_at_12%_75%,oklch(0.45_0.12_300/0.08),transparent_50%)]"
        aria-hidden
      />
      <div className="border-border/20 relative z-0 shrink-0 border-b px-4 py-4 sm:px-6 sm:py-4">
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <LobbySearchBar
            className="min-w-0 grow"
            inputId={searchInputId}
            label={t("searchBarLabel")}
            placeholder={t("searchPlaceholder")}
          />
          <CreateRoomDialog
            isRoomApiReady={isRoomApiReady}
            className="h-10 w-full max-w-2xl shrink-0 text-sm sm:w-auto sm:min-w-34"
          />
        </div>
      </div>
      <div
        className={cn(
          "relative z-0 grid min-h-0 w-full min-w-0 flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(min(100%,28rem),1fr))] content-start gap-4 overflow-y-auto overscroll-y-contain p-4"
        )}
        aria-live="polite"
      >
        {isRoomApiReady ? null : (
          <p className="text-muted-foreground col-span-full text-sm">
            {t("room.feedback.apiNotConfiguredHint")}
          </p>
        )}
        {isRoomApiReady && isLoadingRooms ? (
          <p className="text-muted-foreground col-span-full text-sm">
            {t("room.feedback.loading")}
          </p>
        ) : null}
        {isRoomApiReady && !isLoadingRooms && rooms.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">
            {t("room.feedback.empty")}
          </p>
        ) : null}
        {rooms.map(room => (
          <article
            key={room.id}
            className="hover:border-primary/45 hover:shadow-primary/25 border-border/40 dark:bg-foreground/4 bg-foreground/5 min-h-32 w-full max-w-full min-w-0 cursor-pointer overflow-hidden rounded-xl border p-4 transition-[border-color,box-shadow] duration-200 ease-out hover:shadow-[0_0_22px_-6px]"
          >
            <h3 className="text-foreground mb-1 font-medium">{room.title}</h3>
            {room.description ? (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {room.description}
              </p>
            ) : null}
            <p className="text-muted-foreground/80 mt-2 text-xs">
              {t("room.meta", {
                status: room.status,
                visibility: room.isPublic
                  ? t("room.visibility.public")
                  : t("room.visibility.private"),
                m:
                  room.format === "OXFORD" &&
                  room.maxSeatsPerSide >= 1 &&
                  room.maxSeatsPerSide <= 3
                    ? `${room.maxSeatsPerSide}v${room.maxSeatsPerSide}`
                    : "—"
              })}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LobbyMainContent;
