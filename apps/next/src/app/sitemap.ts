import { routing } from "i18n/routing";

import { getSiteUrl, localePath } from "lib/site";

import type { MetadataRoute } from "next";

const sitemap = (): MetadataRoute.Sitemap => {
  const base = getSiteUrl();
  const routes = ["/", "/login", "/sign-up"];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of routing.locales) {
      const path = localePath(locale, route);
      entries.push({
        url: `${base}${path}`,
        lastModified: new Date(),
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1 : 0.7
      });
    }
  }

  return entries;
};

export default sitemap;
