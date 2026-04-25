"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useId, useState } from "react";
import { toast } from "sonner";

import Button from "ui/Button/Button";
import { createClient } from "utils/supabase/component";
import type { Room } from "lib/room/room.types";
import {
  createTestRoom,
  fetchLobbyRooms,
  isApiConfigured
} from "lib/room/roomApi";
import { cn } from "lib/utils";
import type { LobbyMainContentProps as Props } from "./LobbyMainContent.types";
import LobbySearchBar from "./LobbySearchBar/LobbySearchBar";

const LobbyMainContent: React.FC<Props> = props => {
  const { className } = props;
  const t = useTranslations("Lobby");
  const searchInputId = `lobby-search-${useId()}`;
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(() => isApiConfigured());
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isApiConfigured()) {
      return;
    }
    let cancel = false;
    fetchLobbyRooms()
      .then(data => {
        if (!cancel) {
          setRooms(data);
          setIsLoadingRooms(false);
        }
      })
      .catch(() => {
        if (!cancel) {
          toast.error(t("roomsLoadError"));
          setRooms([]);
          setIsLoadingRooms(false);
        }
      });
    return () => {
      cancel = true;
    };
  }, [t]);

  const handleCreateTest = async () => {
    if (!isApiConfigured()) {
      toast.error(t("apiNotConfigured"));
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      toast.error(t("apiNotConfigured"));
      return;
    }
    setIsCreating(true);
    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session?.access_token) {
        toast.error(t("loginToCreateRoom"));
        return;
      }
      const created = await createTestRoom(data.session.access_token);
      setRooms(prev => [created, ...prev]);
      toast.success(t("testRoomCreated"));
    } catch {
      toast.error(t("createRoomError"));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className={className} aria-label={t("lobbyContentRegion")}>
      <div className="border-border/20 shrink-0 border-b px-4 py-4 sm:px-6 sm:py-4">
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <LobbySearchBar
            className="min-w-0 grow"
            inputId={searchInputId}
            label={t("searchBarLabel")}
            placeholder={t("searchPlaceholder")}
          />
          <Button
            type="button"
            onClick={handleCreateTest}
            isDisabled={!isApiConfigured() || isCreating}
            isLoading={isCreating}
            text={t("createTestRoom")}
            className="hover:bg-primary/90 w-full max-w-2xl shrink-0 px-4 text-sm sm:h-10 sm:w-auto sm:min-w-[8.5rem]"
          />
        </div>
      </div>
      <div
        className={cn(
          "grid min-h-0 w-full min-w-0 flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(min(100%,28rem),1fr))] content-start gap-4 overflow-y-auto overscroll-y-contain p-4"
        )}
        aria-live="polite"
      >
        {isApiConfigured() ? null : (
          <p className="text-muted-foreground col-span-full text-sm">
            {t("apiNotConfiguredHint")}
          </p>
        )}
        {isApiConfigured() && isLoadingRooms ? (
          <p className="text-muted-foreground col-span-full text-sm">
            {t("roomsLoading")}
          </p>
        ) : null}
        {isApiConfigured() && !isLoadingRooms && rooms.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-sm">
            {t("noRoomsInLobby")}
          </p>
        ) : null}
        {rooms.map(room => (
          <article
            key={room.id}
            className="border-border/40 dark:bg-foreground/4 bg-foreground/5 min-h-32 w-full max-w-full min-w-0 overflow-hidden rounded-xl border p-4"
          >
            <h3 className="text-foreground mb-1 font-medium">{room.title}</h3>
            {room.description ? (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {room.description}
              </p>
            ) : null}
            <p className="text-muted-foreground/80 mt-2 text-xs">
              {t("roomMeta", {
                status: room.status,
                visibility: room.isPublic
                  ? t("roomVisiblePublic")
                  : t("roomVisiblePrivate"),
                n: room.maxSeats
              })}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LobbyMainContent;
