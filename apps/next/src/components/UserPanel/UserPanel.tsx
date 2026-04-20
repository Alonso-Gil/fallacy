"use client";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import AuthActionButton from "ui/AuthActionButton";
import SettingsDialog from "components/SettingsDialog/SettingsDialog";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { useAuthStore } from "store/auth/auth.store";
import { UserPanelProps as Props } from "./UserPanel.types";

const UserPanel: React.FC<Props> = ({ className }) => {
  const tSettings = useTranslations("Settings");
  const tLobby = useTranslations("Lobby");
  const user = useAuthStore(state => state.user);
  const isAuthenticated = user !== null;

  return (
    <div
      className={cn(className, "bg-background flex w-full flex-col gap-2 p-4")}
    >
      {!isAuthenticated && (
        <p className="text-text-secondary/80 px-0.5 text-[0.7rem] tracking-wide">
          {tLobby("account.helper")}
        </p>
      )}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <AuthActionButton />
        </div>
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
