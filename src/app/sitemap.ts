import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all published listings
  const listings = await prisma.listings.findMany({
    where: {
      status: "published",
    },
    select: {
      id: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // Get all cities with listings
  const cities = await prisma.cities.findMany({
    select: {
      name: true,
      created_at: true,
    },
  });

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  // Listing pages
  const listingPages = listings.map((listing) => ({
    url: `${BASE_URL}/listing/${listing.id}`,
    lastModified: listing.created_at,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Search pages by city
  const cityPages = cities.map((city) => ({
    url: `${BASE_URL}/search?city=${encodeURIComponent(city.name)}`,
    lastModified: city.created_at,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...listingPages, ...cityPages] as MetadataRoute.Sitemap;
}

// Revalidate the sitemap every hour
export const revalidate = 3600;
