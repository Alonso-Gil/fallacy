"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Switch } from "ui/shadcnComponents/switch";
import { useIsClient } from "hooks/useIsClient";

const SettingAppearance = () => {
  const t = useTranslations("Settings");
  const isClient = useIsClient();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = isClient && resolvedTheme === "dark";

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{t("darkMode")}</span>
        <span className="text-text-secondary text-xs">
          {isDark ? t("themeDark") : t("themeLight")}
        </span>
      </div>
      <Switch
        checked={isDark}
        onCheckedChange={handleThemeChange}
        disabled={!isClient}
        aria-label={t("darkMode")}
      />
    </div>
  );
};

export default SettingAppearance;
