"use client";
import { ArrowRight, Lock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

import { cn } from "lib/utils";
import type { LobbyRoomCardProps as Props } from "./LobbyRoomCard.types";
import {
  getCreatedAtLabel,
  getFormatLabel,
  getPhaseLabel,
  getProgressPercentage,
  getSeatsLabel,
  getStatusLabel,
  getStatusStyles,
  getVisibilityLabel
} from "./LobbyRoomCard.utils";

const baseBadgeClasses =
  "inline-flex h-5 items-center rounded-full border px-2 text-[11px] font-medium tracking-wide";

const neutralBadgeClasses =
  "border-border/60 bg-foreground/5 text-foreground/80 dark:bg-foreground/10";

const LobbyRoomCard: React.FC<Props> = props => {
  const { room } = props;
  const t = useTranslations("Lobby");
  const locale = useLocale();
  const statusLabel = getStatusLabel(room.status, t);
  const statusStyles = getStatusStyles(room.status);
  const visibilityLabel = getVisibilityLabel(room.isPublic, t);
  const formatLabel = getFormatLabel(room.format, t);
  const seatsLabel = getSeatsLabel(room.format, room.maxSeatsPerSide, t);
  const createdLabel = getCreatedAtLabel(room.createdAt, locale);

  const summaryText = room.motion ?? room.description;

  const oxfordConfig = room.format === "OXFORD" ? room.formatConfig : null;
  const phaseLabel = oxfordConfig
    ? getPhaseLabel(oxfordConfig.currentPhase, t)
    : null;
  const progressPercentage = getProgressPercentage(
    room.formatConfig,
    room.status
  );
  const totalPhases = oxfordConfig?.debatePhases.length ?? 0;
  const currentPhaseNumber = oxfordConfig
    ? oxfordConfig.currentPhaseIndex + 1
    : 0;

  return (
    <article
      className={cn(
        "group/card relative flex min-h-[190px] w-full max-w-full min-w-0 cursor-pointer flex-col overflow-hidden",
        "border-border/50 bg-card/90 rounded-2xl border shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/4",
        "transition-all duration-200 ease-out",
        "hover:border-primary/50 hover:bg-card hover:shadow-primary/5 hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-orange-500/40 dark:hover:bg-white/5",
        "focus-within:border-primary/50 focus-within:shadow-lg dark:focus-within:border-orange-500/40"
      )}
    >
      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn(baseBadgeClasses, statusStyles)}>
            {statusLabel}
          </span>
          <span className={cn(baseBadgeClasses, neutralBadgeClasses)}>
            {room.isPublic ? null : (
              <Lock className="mr-1 size-3" strokeWidth={2} aria-hidden />
            )}
            {visibilityLabel}
          </span>
          <span className={cn(baseBadgeClasses, neutralBadgeClasses)}>
            {formatLabel}
          </span>
          {seatsLabel ? (
            <span className={cn(baseBadgeClasses, neutralBadgeClasses)}>
              {seatsLabel}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-foreground line-clamp-2 text-[15px] leading-snug font-semibold tracking-tight dark:text-white">
            {room.title}
          </h3>
          {summaryText ? (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug dark:text-white/60">
              {summaryText}
            </p>
          ) : null}
        </div>

        {oxfordConfig ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase dark:text-white/45">
              {t("room.currentPhaseLabel")}
            </p>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-foreground/80 line-clamp-1 font-medium dark:text-white/75">
                {phaseLabel}
              </span>
              <span className="text-muted-foreground shrink-0 tabular-nums">
                {t("room.progressCount", {
                  current: currentPhaseNumber,
                  total: totalPhases
                })}
              </span>
            </div>
            <progress
              className="[&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-foreground/10 [&::-webkit-progress-value]:bg-primary h-1 w-full overflow-hidden rounded-full [&::-moz-progress-bar]:rounded-full dark:[&::-moz-progress-bar]:bg-orange-400/80 [&::-webkit-progress-bar]:dark:bg-white/10 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-500 [&::-webkit-progress-value]:ease-out dark:[&::-webkit-progress-value]:bg-orange-400/80"
              value={progressPercentage}
              max={100}
              aria-label={t("room.currentPhaseLabel")}
            />
          </div>
        ) : null}
      </div>

      <div className="border-border/40 flex items-center justify-between border-t px-3.5 py-2.5">
        <p className="text-muted-foreground text-xs">{createdLabel}</p>
        <span className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ease-out dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 dark:hover:text-orange-300">
          {t("room.actions.enter")}
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </article>
  );
};

export default LobbyRoomCard;
