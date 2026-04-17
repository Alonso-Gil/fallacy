"use client";
import { usePathname, useRouter } from "i18n/navigation";
import { routing } from "i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import React, { useSyncExternalStore } from "react";

import { cn } from "lib/utils";
import { LocaleSwitcherButtonProps as Props } from "./LocaleSwitcherButton.types";

const emptySubscribe = () => () => {};

const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

const LocaleSwitcherButton: React.FC<Props> = ({ className }) => {
  const isClient = useIsClient();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Common.localeSwitcher");

  const targetLocale =
    routing.locales.find(code => code !== locale) ?? routing.defaultLocale;

  if (!isClient) {
    return null;
  }

  return (
    <button
      type="button"
      className={cn(
        className,
        "rounded-xl bg-slate-200 px-10 py-2 duration-200 dark:bg-[#212933]"
      )}
      aria-label={t("ariaSwitchTo", {
        locale: t(`label.${targetLocale}`)
      })}
      onClick={() => {
        router.replace(pathname || "/", { locale: targetLocale });
      }}
    >
      {targetLocale.toUpperCase()}
    </button>
  );
};

export default LocaleSwitcherButton;
