import type { MetadataRoute } from "next";

const siteUrl = "https://mr-mobile-wala-repairs.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin-login", "/dashboard", "/analytics", "/customers", "/devices", "/inventory", "/jobs", "/settings", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
