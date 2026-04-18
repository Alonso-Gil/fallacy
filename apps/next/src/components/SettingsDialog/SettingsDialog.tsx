"use client";
import { useTranslations } from "next-intl";
import React from "react";

import LocaleSwitcherButton from "ui/LocaleSwitcherButton/LocaleSwitcherButton";
import ThemeSwitcherButton from "ui/ThemeSwitcherButton/ThemeSwitcherButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "components/ui/dialog";
import { SettingsDialogProps as Props } from "./SettingsDialog.types";

const SettingsDialog: React.FC<Props> = ({ children }) => {
  const t = useTranslations("Settings");

  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("appearance")}</span>
            <ThemeSwitcherButton />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t("language")}</span>
            <LocaleSwitcherButton />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
