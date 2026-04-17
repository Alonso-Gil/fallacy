import { getSiteUrl } from "lib/site";

import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"]
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`
  };
};

export default robots;
