"use client";
import { useTranslations } from "next-intl";
import React from "react";

import { Separator } from "ui/separator";
import SettingAppearance from "components/settings/SettingAppearance";
import SettingLanguage from "components/settings/SettingLanguage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "components/ui/dialog";
import { cn } from "lib/utils";
import { useSettingsDialogStore } from "store/settingsDialog/settingsDialog.store";
import { SettingsDialogProps as Props } from "./SettingsDialog.types";
import { SETTINGS_SECTIONS } from "./SettingsDialog.utils";

const SettingsDialog: React.FC<Props> = ({ children }) => {
  const t = useTranslations("Settings");
  const isOpen = useSettingsDialogStore(state => state.isOpen);
  const selectedSetting = useSettingsDialogStore(
    state => state.selectedSetting
  );
  const setIsOpen = useSettingsDialogStore(state => state.setIsOpen);
  const setSelectedSetting = useSettingsDialogStore(
    state => state.setSelectedSetting
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="h-[80vh] gap-0 overflow-hidden p-0 sm:max-w-[70vw]">
        <div className="flex h-full">
          <aside className="bg-background border-border flex w-60 shrink-0 flex-col gap-1 overflow-y-auto border-r p-4">
            <h2 className="text-text-secondary px-2 pt-2 pb-3 text-xs font-semibold tracking-wide uppercase">
              {t("title")}
            </h2>
            <nav className="flex flex-col gap-1">
              {SETTINGS_SECTIONS.map(({ id, icon: Icon }) => {
                const isActive = selectedSetting === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedSetting(id)}
                    className={cn(
                      "hover:bg-surface-secondary flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary"
                        : "text-text hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t(id)}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="bg-surface flex flex-1 flex-col overflow-y-auto p-8">
            <header className="flex flex-col gap-1">
              <DialogTitle className="text-2xl font-semibold">
                {t(selectedSetting)}
              </DialogTitle>
              <DialogDescription>
                {t(`${selectedSetting}Description`)}
              </DialogDescription>
            </header>

            <Separator className="my-6" />

            <div className="flex flex-col gap-6">
              {selectedSetting === "appearance" && <SettingAppearance />}
              {selectedSetting === "language" && <SettingLanguage />}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
