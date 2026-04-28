"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useId } from "react";
import { toast } from "sonner";

import { cn } from "lib/utils";
import { isRoomApiConfigured } from "services/room/room.service";
import { useFetchLobbyRooms } from "services/room/room.service.hooks";
import CreateRoomDialog from "./CreateRoomDialog/CreateRoomDialog";
import type { LobbyMainContentProps as Props } from "./LobbyMainContent.types";
import LobbyRoomCard from "./LobbyRoomCard/LobbyRoomCard";
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
      <div className="border-border/20 relative z-0 shrink-0 border-b px-4 pt-4 pb-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-384 min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
            <LobbySearchBar
              className="w-full sm:max-w-[640px] sm:flex-1"
              inputId={searchInputId}
              label={t("searchBarLabel")}
              placeholder={t("searchPlaceholder")}
            />
            <CreateRoomDialog
              isRoomApiReady={isRoomApiReady}
              className="shadow-primary/15 hover:shadow-primary/25 h-11 w-full rounded-xl px-5 text-sm font-semibold shadow-lg transition-all sm:w-auto sm:min-w-32"
            />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "relative z-0 min-h-0 w-full min-w-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pt-4 pb-4 sm:px-6 sm:pb-6"
        )}
        aria-live="polite"
      >
        <div className="mx-auto grid w-full max-w-384 auto-rows-min grid-cols-[repeat(auto-fill,minmax(min(100%,28rem),1fr))] content-start gap-4">
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
            <LobbyRoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LobbyMainContent;
