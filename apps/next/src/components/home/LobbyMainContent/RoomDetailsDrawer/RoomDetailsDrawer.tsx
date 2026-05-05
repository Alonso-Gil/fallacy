"use client";
import { ArrowRight, ChevronDown, Lock, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

import Button from "ui/Button/Button";
import { Button as IconButton } from "ui/shadcnComponents/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "ui/shadcnComponents/dialog";
import { cn } from "lib/utils";
import { useRouter } from "i18n/navigation";
import {
  getCreatedAtLabel,
  getProgressPercentage,
  getSeatsLabel,
  getStatusStyles
} from "../LobbyRoomCard/LobbyRoomCard.utils";
import type { RoomDetailsDrawerProps as Props } from "./RoomDetailsDrawer.types";
import {
  getDebateFormatLabel,
  getDebatePhaseLabel,
  getParticipantCapacityLabel,
  getRoomAccessLabel,
  getRoomStatusLabel
} from "./RoomDetailsDrawer.utils";

const baseBadgeClasses =
  "inline-flex h-5 items-center rounded-full border px-2 text-[11px] font-medium tracking-wide";

const neutralBadgeClasses = "border-white/10 bg-white/7 text-white/78";

const sectionClasses =
  "rounded-2xl border border-white/10 bg-white/[0.045] p-3.5 shadow-sm";

const detailItemClasses =
  "rounded-xl border border-white/10 bg-black/10 px-3 py-2.5";

const RoomDetailsDrawer: React.FC<Props> = props => {
  const { room, open, onOpenChange } = props;
  const router = useRouter();
  const t = useTranslations("Lobby");
  const locale = useLocale();

  if (!room) {
    return null;
  }

  const statusLabel = getRoomStatusLabel(room.status, t);
  const statusStyles = getStatusStyles(room.status);
  const accessLabel = getRoomAccessLabel(room.isPublic, t);
  const formatLabel = getDebateFormatLabel(room.format, t);
  const seatsLabel =
    getSeatsLabel(room.format, room.maxSeatsPerSide, t) ??
    t("room.seatsLabel", { n: room.maxSeatsPerSide });
  const createdLabel = getCreatedAtLabel(room.createdAt, locale);
  const oxfordConfig = room.format === "OXFORD" ? room.formatConfig : null;
  const debatePhases = oxfordConfig?.debatePhases ?? [];
  const isPhaseAvailable = !!oxfordConfig && debatePhases.length > 0;
  const currentPhaseLabel = oxfordConfig
    ? getDebatePhaseLabel(oxfordConfig.currentPhase, t)
    : t("room.details.noPhase");
  const currentPhaseNumber = oxfordConfig
    ? oxfordConfig.currentPhaseIndex + 1
    : 0;
  const progressPercentage = getProgressPercentage(
    room.formatConfig,
    room.status
  );
  const motion = room.motion?.trim() ?? "";
  const description = room.description?.trim() ?? "";
  const maxSeatsPerSide = room.maxSeatsPerSide ?? 0;
  const propositionSeats = getParticipantCapacityLabel(0, maxSeatsPerSide, t);
  const oppositionSeats = getParticipantCapacityLabel(0, maxSeatsPerSide, t);

  const handleEnterRoom = () => {
    onOpenChange(false);
    router.push(`/room/${room.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "top-auto right-2 bottom-2 left-2 grid h-[86dvh] max-h-[86dvh] max-w-none translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-3xl p-0",
          "border border-white/10 bg-[#181619]/96 text-white shadow-2xl shadow-black/35 backdrop-blur-xl",
          "data-open:slide-in-from-bottom-4 data-open:zoom-in-100 data-closed:slide-out-to-bottom-4 data-closed:zoom-out-100",
          "sm:data-open:slide-in-from-right-5 sm:data-closed:slide-out-to-right-5 sm:top-3 sm:right-3 sm:bottom-3 sm:left-auto sm:h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-1.5rem)] sm:w-[28.75rem] sm:translate-x-0 sm:translate-y-0"
        )}
      >
        <div className="relative overflow-hidden border-b border-white/10 px-4 py-4 sm:px-5">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_0%,oklch(0.68_0.16_45/0.18),transparent_58%),radial-gradient(ellipse_60%_50%_at_100%_10%,oklch(0.5_0.14_300/0.12),transparent_55%)]"
            aria-hidden
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-3">
              <div className="min-w-0 space-y-1.5">
                <DialogTitle className="line-clamp-2 text-xl leading-tight font-semibold tracking-tight text-white">
                  {room.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {t("room.details.previewDescription")}
                </DialogDescription>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={cn(baseBadgeClasses, statusStyles)}>
                  {statusLabel}
                </span>
                <span className={cn(baseBadgeClasses, neutralBadgeClasses)}>
                  {room.isPublic ? null : (
                    <Lock className="mr-1 size-3" strokeWidth={2} aria-hidden />
                  )}
                  {accessLabel}
                </span>
                <span className={cn(baseBadgeClasses, neutralBadgeClasses)}>
                  {formatLabel}
                </span>
                <span className={cn(baseBadgeClasses, neutralBadgeClasses)}>
                  {seatsLabel}
                </span>
              </div>
            </div>
            <DialogClose
              render={
                <IconButton
                  variant="ghost"
                  size="icon-sm"
                  className="mt-0.5 shrink-0"
                />
              }
            >
              <X className="size-4" aria-hidden />
              <span className="sr-only">{t("room.details.close")}</span>
            </DialogClose>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto px-4 py-3.5 [scrollbar-color:rgba(255,255,255,0.16)_transparent] [scrollbar-width:thin] sm:px-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb:hover]:bg-white/25 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="flex flex-col gap-3">
            <section className={sectionClasses}>
              {motion ? (
                <div className="space-y-1.5">
                  <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    {t("room.details.motion")}
                  </p>
                  <p className="text-[15px] leading-relaxed font-medium text-white/90">
                    {motion}
                  </p>
                </div>
              ) : null}
              {description ? (
                <div className={cn("space-y-1.5", motion && "mt-3")}>
                  <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    {t("room.details.description")}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed dark:text-white/60">
                    {description}
                  </p>
                </div>
              ) : null}
              {!motion && !description ? (
                <p className="text-muted-foreground text-sm">
                  {t("room.details.noDescription")}
                </p>
              ) : null}
            </section>

            <section className={sectionClasses}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    {t("room.currentPhaseLabel")}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm font-medium text-white/85">
                    {currentPhaseLabel}
                  </p>
                </div>
                {isPhaseAvailable ? (
                  <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                    {t("room.progressCount", {
                      current: currentPhaseNumber,
                      total: debatePhases.length
                    })}
                  </span>
                ) : null}
              </div>
              <progress
                className="[&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-foreground/10 [&::-webkit-progress-value]:bg-primary mt-3 h-1.5 w-full overflow-hidden rounded-full [&::-moz-progress-bar]:rounded-full dark:[&::-moz-progress-bar]:bg-orange-400/80 [&::-webkit-progress-bar]:dark:bg-white/10 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-500 [&::-webkit-progress-value]:ease-out dark:[&::-webkit-progress-value]:bg-orange-400/80"
                value={progressPercentage}
                max={100}
                aria-label={t("room.currentPhaseLabel")}
              />
            </section>

            <section className={sectionClasses}>
              <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                {t("room.details.participants")}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className={detailItemClasses}>
                  <p className="text-muted-foreground text-xs">
                    {t("room.details.proposition")}
                  </p>
                  <p className="text-foreground mt-1 text-sm font-semibold tabular-nums">
                    {propositionSeats}
                  </p>
                </div>
                <div className={detailItemClasses}>
                  <p className="text-muted-foreground text-xs">
                    {t("room.details.opposition")}
                  </p>
                  <p className="text-foreground mt-1 text-sm font-semibold tabular-nums">
                    {oppositionSeats}
                  </p>
                </div>
              </div>
            </section>

            <details className={cn(sectionClasses, "group p-0")}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    {t("room.details.formatAndRules")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white/85">
                    {formatLabel}
                  </p>
                </div>
                <ChevronDown className="text-muted-foreground size-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-border/40 border-t px-4 py-3">
                {debatePhases.length > 0 ? (
                  <ol className="space-y-2">
                    {debatePhases.map((phase, index) => {
                      const isCurrentPhase =
                        oxfordConfig?.currentPhaseIndex === index;
                      return (
                        <li
                          key={`${phase}-${index}`}
                          className={cn(
                            "flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm",
                            isCurrentPhase
                              ? "bg-primary/10 text-primary dark:bg-orange-500/10 dark:text-orange-300"
                              : "text-muted-foreground"
                          )}
                        >
                          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] tabular-nums">
                            {index + 1}
                          </span>
                          <span>{getDebatePhaseLabel(phase, t)}</span>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t("room.details.noRules")}
                  </p>
                )}
              </div>
            </details>

            <section className={sectionClasses}>
              <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                {t("room.details.details")}
              </p>
              <div className="mt-3 grid gap-2">
                <div className={detailItemClasses}>
                  <p className="text-muted-foreground text-xs">
                    {t("room.details.createdAt")}
                  </p>
                  <p className="text-foreground mt-1 text-sm font-medium">
                    {createdLabel}
                  </p>
                </div>
                <div className={detailItemClasses}>
                  <p className="text-muted-foreground text-xs">
                    {t("room.details.access")}
                  </p>
                  <p className="text-foreground mt-1 text-sm font-medium">
                    {accessLabel}
                  </p>
                </div>
                <div className={detailItemClasses}>
                  <p className="text-muted-foreground text-xs">
                    {t("room.details.status")}
                  </p>
                  <p className="text-foreground mt-1 text-sm font-medium">
                    {statusLabel}
                  </p>
                </div>
                {room.createdBy ? (
                  <div className={detailItemClasses}>
                    <p className="text-muted-foreground text-xs">
                      {t("room.details.creator")}
                    </p>
                    <p className="text-foreground mt-1 truncate text-sm font-medium">
                      {room.createdBy}
                    </p>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-white/10 bg-[#181619]/95 p-4 backdrop-blur sm:flex-row sm:justify-end sm:px-5">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            text={t("room.details.cancel")}
            className="h-10 w-full bg-transparent text-sm sm:w-auto sm:min-w-28"
            variant="outline"
          />
          <Button
            type="button"
            onClick={handleEnterRoom}
            icon={<ArrowRight className="size-4" aria-hidden />}
            text={t("room.details.enterRoom")}
            glow
            className="h-10 w-full text-sm sm:w-auto sm:min-w-36"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsDrawer;
