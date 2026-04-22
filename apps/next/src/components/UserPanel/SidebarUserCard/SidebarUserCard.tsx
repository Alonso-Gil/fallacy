"use client";
import type { User } from "@supabase/supabase-js";
import { Minus } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";

import { cn } from "lib/utils";
import { SidebarUserCardProps as Props } from "./SidebarUserCard.types";

const getDisplayName = (user: User) => {
  const meta = user.user_metadata;
  if (typeof meta?.full_name === "string" && meta.full_name.trim()) {
    return meta.full_name.trim();
  }
  if (typeof meta?.name === "string" && meta.name.trim()) {
    return meta.name.trim();
  }
  const email = user.email?.split("@")[0];
  return email?.trim() || "—";
};

const getInitials = (name: string) => {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
};

const SidebarUserCard: React.FC<Props> = props => {
  const { className, user } = props;
  const t = useTranslations("Lobby.account");

  const displayName = useMemo(() => getDisplayName(user), [user]);

  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const avatarUrl =
    typeof user.user_metadata?.avatar_url === "string" &&
    user.user_metadata.avatar_url.trim()
      ? user.user_metadata.avatar_url.trim()
      : null;

  return (
    <div className={cn("flex min-h-11 min-w-0 items-center gap-3", className)}>
      <div className="relative shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={44}
            height={44}
            sizes="44px"
            className="border-border/50 box-border h-11 w-11 rounded-full border object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="border-border/50 bg-surface-secondary text-foreground flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold"
            aria-hidden
          >
            {initials}
          </div>
        )}
        <span
          className="border-background absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full border-2 bg-red-500"
          title={t("statusDoNotDisturb")}
        >
          <Minus className="size-2.5 text-white" strokeWidth={3} aria-hidden />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-semibold">
          {displayName}
        </p>
        <p className="text-text-secondary truncate text-xs">
          {t("statusDoNotDisturb")}
        </p>
      </div>
    </div>
  );
};

export default SidebarUserCard;
