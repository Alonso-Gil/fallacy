"use client";
import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import AuthActionButton from "ui/AuthActionButton";
import SettingsDialog from "components/SettingsDialog/SettingsDialog";
import { cn } from "lib/utils";
import { UserPanelProps as Props } from "./UserPanel.types";

const UserPanel: React.FC<Props> = ({ className }) => {
  const t = useTranslations("Settings");

  return (
    <div
      className={cn(
        className,
        "bg-background flex h-full w-full items-center justify-between p-4"
      )}
    >
      <AuthActionButton />
      <SettingsDialog>
        <button
          type="button"
          aria-label={t("openLabel")}
          className="hover:bg-muted rounded p-1 transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      </SettingsDialog>
    </div>
  );
};

export default UserPanel;
