import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import React from "react";

import { getCurrentUser } from "utils/supabase/getCurrentUser";
import Providers from "providers/Providers";
import { routing } from "i18n/routing";

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
  const { user } = await getCurrentUser();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers initialUser={user}>{children}</Providers>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
