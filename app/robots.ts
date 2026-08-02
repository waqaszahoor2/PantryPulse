import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pantrypulse.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/demo", "/privacy", "/terms", "/food-safety"],
      disallow: ["/dashboard", "/pantry", "/add-item", "/shopping-list", "/recommendations", "/insights", "/notifications", "/settings", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
