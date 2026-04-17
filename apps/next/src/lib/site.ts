import { routing } from "i18n/routing";
import { getTranslations } from "next-intl/server";

import type { Metadata } from "next";

export const getSiteUrl = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export const getMetadataBase = (): URL => {
  return new URL(getSiteUrl());
};

export const localePath = (locale: string, pathname: string): string => {
  const p =
    pathname === "/" || pathname === ""
      ? ""
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;
  if (
    locale === routing.defaultLocale &&
    routing.localePrefix === "as-needed"
  ) {
    return p || "/";
  }
  return `/${locale}${p}`;
};

export const alternateLanguages = (
  pathname: string
): Record<string, string> => {
  const normalized =
    pathname === "" || pathname === "/"
      ? "/"
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;
  const out: Record<string, string> = {};
  for (const locale of routing.locales) {
    out[locale] = localePath(locale, normalized);
  }
  out["x-default"] = localePath(routing.defaultLocale, normalized);
  return out;
};

export type PageMetadataInput = {
  locale: string;
  path: string;
  titleKey: string;
  descriptionKey: string;
  absoluteTitle?: boolean;
};

export const buildPageMetadata = async ({
  locale,
  path,
  titleKey,
  descriptionKey,
  absoluteTitle = false
}: PageMetadataInput): Promise<Metadata> => {
  const t = await getTranslations({ locale, namespace: "SEO" });
  const canonicalPath = localePath(locale, path);
  const base = getSiteUrl();
  const title = t(titleKey);
  const description = t(descriptionKey);
  const siteName = t("siteName");
  const socialTitle = absoluteTitle ? title : `${title} | ${siteName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages(path)
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `${base}${canonicalPath}`,
      siteName,
      locale,
      alternateLocale: routing.locales.filter(l => l !== locale),
      type: "website"
    },
    twitter: {
      title: socialTitle,
      description
    }
  };
};
