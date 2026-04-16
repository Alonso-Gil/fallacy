import { routing } from "i18n/routing";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import React from "react";

import Providers from "providers/Providers";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const generateStaticParams = () =>
  routing.locales.map(locale => ({ locale }));

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
