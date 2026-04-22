"use client";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { useSignOut } from "hooks/useSignOut";
import { cn } from "lib/utils";
import { useAuthStore } from "store/auth/auth.store";
import { useSettingsDialogStore } from "store/settingsDialog/settingsDialog.store";
import type { SettingsSidebarLogoutProps as Props } from "./SettingsSidebarLogout.types";

const SettingsSidebarLogout: React.FC<Props> = () => {
  const tAuth = useTranslations("Auth");
  const user = useAuthStore(state => state.user);
  const signOut = useSignOut();
  const setIsOpen = useSettingsDialogStore(state => state.setIsOpen);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className={cn(
        "flex w-full shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
        "border-0 bg-transparent shadow-none",
        "text-red-600 dark:text-[#f87171]",
        "hover:bg-rose-100/95 hover:text-red-700",
        "dark:hover:bg-[#2a181c] dark:hover:text-[#fca5a5]",
        "focus-visible:ring-2 focus-visible:ring-red-400/45 focus-visible:outline-none"
      )}
    >
      <LogOut className="size-4 shrink-0 text-current" aria-hidden />
      {tAuth("logOut")}
    </button>
  );
};

export default SettingsSidebarLogout;
