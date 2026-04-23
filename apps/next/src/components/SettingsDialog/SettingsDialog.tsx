"use client";
import { useTranslations } from "next-intl";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "ui/shadcnComponents/dialog";
import { Separator } from "ui/shadcnComponents/separator";
import SettingAccount from "components/settings/SettingAccount/SettingAccount";
import SettingAppearance from "components/settings/SettingAppearance";
import SettingLanguage from "components/settings/SettingLanguage";
import SettingsSidebarLogout from "components/SettingsDialog/SettingsSidebarLogout/SettingsSidebarLogout";
import { cn } from "lib/utils";
import { useAuthStore } from "store/auth/auth.store";
import { useSettingsDialogStore } from "store/settingsDialog/settingsDialog.store";
import { SettingsDialogProps as Props } from "./SettingsDialog.types";
import { SETTINGS_SECTIONS } from "./SettingsDialog.utils";

const SettingsDialog: React.FC<Props> = ({ children }) => {
  const t = useTranslations("Settings");
  const sessionResolved = useAuthStore(state => state.sessionResolved);
  const user = useAuthStore(state => state.user);
  const showLogoutArea = sessionResolved && user !== null;
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
        <div className="flex h-full min-h-0">
          <aside className="border-border bg-background flex h-full min-h-0 w-60 shrink-0 flex-col border-r">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-4 pb-2">
              <h2 className="text-text-secondary shrink-0 px-2 pb-3 text-xs font-semibold tracking-wide uppercase">
                {t("title")}
              </h2>
              <nav
                className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pr-1"
                aria-label={t("navAriaLabel")}
              >
                {SETTINGS_SECTIONS.map(({ id, icon: Icon }) => {
                  const isActive = selectedSetting === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedSetting(id)}
                      className={cn(
                        "hover:bg-surface-secondary flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
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
            </div>
            {showLogoutArea && (
              <>
                <Separator variant="fade" className="shrink-0" />
                <div className="bg-background shrink-0 px-3 pt-2 pb-3">
                  <SettingsSidebarLogout />
                </div>
              </>
            )}
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
              {selectedSetting === "account" && <SettingAccount />}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
