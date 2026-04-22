"use client";
import { useTranslations } from "next-intl";
import React from "react";

import { useAuthStore } from "store/auth/auth.store";
import type { SettingAccountProps as Props } from "./SettingAccount.types";

const SettingAccount: React.FC<Props> = () => {
  const t = useTranslations("Settings");
  const user = useAuthStore(state => state.user);

  if (!user) {
    return (
      <p className="text-text-secondary text-sm">{t("accountSignInHint")}</p>
    );
  }

  return <p className="text-text-secondary text-sm">{t("accountPanelBody")}</p>;
};

export default SettingAccount;
