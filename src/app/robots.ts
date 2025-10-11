import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/listing/*", "/search"],
        disallow: ["/api/*", "/auth", "/checkout/*", "/profile/*", "/hosting/*", "/_next/*", "/static/*"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

