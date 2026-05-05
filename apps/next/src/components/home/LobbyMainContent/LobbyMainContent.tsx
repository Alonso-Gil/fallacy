"use client";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useId, useState } from "react";

import { cn } from "lib/utils";
import { useFetchLobbyRooms } from "services/room/room.service.hooks";
import type { RoomEntity } from "services/room/room.service.types";
import LobbyMainContentEmpty from "./LobbyMainContent.empty";
import LobbyMainContentError from "./LobbyMainContent.error";
import LobbyMainContentPlaceholder from "./LobbyMainContent.placeholder";
import type { LobbyMainContentProps as Props } from "./LobbyMainContent.types";
import LobbyRoomCard from "./LobbyRoomCard/LobbyRoomCard";
import LobbySearchBar from "./LobbySearchBar/LobbySearchBar";
import RoomDetailsDrawer from "./RoomDetailsDrawer/RoomDetailsDrawer";

const LobbyMainContent: React.FC<Props> = props => {
  const { className } = props;
  const t = useTranslations("Lobby");
  const searchInputId = `lobby-search-${useId()}`;
  const [filteredRooms, setFilteredRooms] = useState<RoomEntity[] | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomEntity | null>(null);
  const [isRoomDrawerOpen, setIsRoomDrawerOpen] = useState(false);
  const {
    data: rooms = [],
    isLoading: isLoadingRooms,
    isError: isRoomsError,
    isRefetching: isRetryingRooms,
    refetch: refetchRooms
  } = useFetchLobbyRooms();
  const visibleRooms = isFilterActive ? (filteredRooms ?? rooms) : rooms;
  const isRoomsEmpty = !isLoadingRooms && !isRoomsError && rooms.length === 0;
  const isFilteredRoomsEmpty =
    !isLoadingRooms &&
    !isRoomsError &&
    rooms.length > 0 &&
    visibleRooms.length === 0;

  const handleFilteredRoomsChange = useCallback(
    (nextFilteredRooms: RoomEntity[], nextIsFilterActive: boolean) => {
      setFilteredRooms(nextFilteredRooms);
      setIsFilterActive(nextIsFilterActive);
    },
    []
  );

  const handlePreviewRoom = useCallback((room: RoomEntity) => {
    setSelectedRoom(room);
    setIsRoomDrawerOpen(true);
  }, []);

  const handleRoomDrawerOpenChange = useCallback((nextOpen: boolean) => {
    setIsRoomDrawerOpen(nextOpen);
  }, []);

  const renderRooms = () => {
    if (isLoadingRooms) {
      return <LobbyMainContentPlaceholder />;
    }

    if (isRoomsError) {
      return (
        <LobbyMainContentError
          isRetryingRooms={isRetryingRooms}
          onRetry={() => void refetchRooms()}
        />
      );
    }

    if (isRoomsEmpty) {
      return <LobbyMainContentEmpty />;
    }

    if (isFilteredRoomsEmpty && isFilterActive) {
      return (
        <div className="mx-auto flex min-h-full w-full max-w-384 items-center justify-center">
          <div className="border-border/60 bg-card/90 flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border px-6 py-10 text-center shadow-sm backdrop-blur-sm">
            <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
              <Search className="size-6" aria-hidden />
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-foreground text-lg font-semibold">
                {t("room.feedback.noFilterResultsTitle")}
              </h2>
              <p className="text-muted-foreground text-sm">
                {t("room.feedback.noFilterResultsDescription")}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto grid w-full max-w-384 auto-rows-min grid-cols-[repeat(auto-fill,minmax(min(100%,28rem),1fr))] content-start gap-4">
        {visibleRooms.map(room => (
          <LobbyRoomCard
            key={room.id}
            room={room}
            onSelect={() => handlePreviewRoom(room)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <section
        className={cn("relative isolate overflow-hidden", className)}
        aria-label={t("lobbyContentRegion")}
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_85%_at_50%_-5%,oklch(0.75_0.14_45/0.11),transparent_58%),radial-gradient(ellipse_55%_45%_at_92%_45%,oklch(0.55_0.14_300/0.07),transparent_52%),radial-gradient(ellipse_40%_35%_at_12%_75%,oklch(0.5_0.12_300/0.05),transparent_50%)] dark:bg-[radial-gradient(ellipse_100%_85%_at_50%_-5%,oklch(0.6_0.14_45/0.14),transparent_58%),radial-gradient(ellipse_55%_45%_at_92%_45%,oklch(0.5_0.15_300/0.1),transparent_52%),radial-gradient(ellipse_40%_35%_at_12%_75%,oklch(0.45_0.12_300/0.08),transparent_50%)]"
          aria-hidden
        />
        <div className="border-border/20 relative z-0 shrink-0 border-b px-4 pt-4 pb-3 sm:px-6">
          <div className="mx-auto flex w-full flex-col items-stretch gap-3">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
              <LobbySearchBar
                className="LobbySearchBar w-full sm:flex-1"
                inputId={searchInputId}
                label={t("searchBarLabel")}
                rooms={rooms}
                onFilteredRoomsChange={handleFilteredRoomsChange}
                placeholder={t("searchPlaceholder")}
              />
            </div>
          </div>
        </div>
        <div
          className="relative z-0 min-h-0 w-full min-w-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pt-4 pb-4 sm:px-6 sm:pb-6"
          aria-busy={isLoadingRooms}
          aria-live="polite"
        >
          {renderRooms()}
        </div>
      </section>
      <RoomDetailsDrawer
        room={selectedRoom}
        open={isRoomDrawerOpen}
        onOpenChange={handleRoomDrawerOpenChange}
      />
    </>
  );
};

export default LobbyMainContent;
