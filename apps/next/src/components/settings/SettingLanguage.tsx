"use client";
import { usePathname, useRouter } from "i18n/navigation";
import { routing } from "i18n/routing";
import { useLocale, useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "ui/shadcnComponents/select";

const SettingLanguage = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const tLocale = useTranslations("Common.localeSwitcher");
  const t = useTranslations("Settings");

  const handleLocaleChange = (value: unknown) => {
    const targetLocale = value as (typeof routing.locales)[number];
    if (targetLocale === locale) return;
    router.replace(pathname || "/", { locale: targetLocale });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{t("language")}</span>
        <span className="text-text-secondary text-xs">
          {t("languageDescription")}
        </span>
      </div>
      <Select value={locale} onValueChange={handleLocaleChange}>
        <SelectTrigger className="w-60">
          <SelectValue>
            {value => tLocale(`label.${value as string}`)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          align="start"
          sideOffset={6}
        >
          {routing.locales.map(code => (
            <SelectItem
              key={code}
              value={code}
              className="focus:bg-surface-secondary focus:text-text p-2"
            >
              {tLocale(`label.${code}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SettingLanguage;
