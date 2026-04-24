"use client";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import AuthActionButton from "ui/AuthActionButton";
import { Button } from "ui/shadcnComponents/button";
import SettingsDialog from "components/SettingsDialog/SettingsDialog";
import { cn } from "lib/utils";
import { useAuthStore } from "store/auth/auth.store";
import SidebarUserCard from "./SidebarUserCard/SidebarUserCard";
import { UserPanelProps as Props } from "./UserPanel.types";

const UserPanel: React.FC<Props> = props => {
  const { className } = props;
  const tSettings = useTranslations("Settings");
  const tLobby = useTranslations("Lobby");
  const sessionResolved = useAuthStore(state => state.sessionResolved);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = user !== null;
  const showAuthLoader = !sessionResolved;

  return (
    <div
      className={cn(className, "bg-background flex w-full flex-col gap-2 p-4")}
    >
      {sessionResolved && !isAuthenticated && (
        <p className="text-text-secondary/80 px-0.5 text-[0.7rem] tracking-wide">
          {tLobby("account.helper")}
        </p>
      )}
      <div className="flex min-h-11 items-center gap-3">
        {showAuthLoader && (
          <div
            className="flex min-h-11 min-w-0 flex-1 items-center gap-3"
            aria-busy
            aria-label={tLobby("account.authLoading")}
          >
            <div className="bg-muted/50 size-11 shrink-0 animate-pulse rounded-full" />
            <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5">
              <div className="bg-muted/50 h-3.5 w-30 max-w-[85%] animate-pulse rounded-md" />
              <div className="bg-muted/50 h-3 w-24 max-w-[65%] animate-pulse rounded-md" />
            </div>
          </div>
        )}
        {!showAuthLoader && isAuthenticated && (
          <SidebarUserCard user={user} className="min-w-0 flex-1" />
        )}
        {!showAuthLoader && !isAuthenticated && (
          <div className="flex min-h-11 min-w-0 flex-1 items-center">
            <AuthActionButton />
          </div>
        )}
        <SettingsDialog>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            aria-label={tSettings("openLabel")}
            className="border-border/60 hover:bg-surface-secondary hover:border-border"
          >
            <Settings />
          </Button>
        </SettingsDialog>
      </div>
    </div>
  );
};

export default UserPanel;
