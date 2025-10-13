"use server";

import { prisma } from "@/lib/prisma";
import { City } from "@/lib/types/cities";

export async function searchCities(searchTerm: string): Promise<City[]> {
  try {
    const cities = await prisma.cities.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 10,
    });

    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      state: city.state,
      country: city.country,
      lat: Number(city.lat),
      lng: Number(city.lng),
    }));
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
}

export async function getAllCities(): Promise<City[]> {
  try {
    const cities = await prisma.cities.findMany({
      orderBy: {
        name: "asc",
      },
      take: 50,
    });

    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      state: city.state,
      country: city.country,
      lat: Number(city.lat),
      lng: Number(city.lng),
    }));
  } catch (error) {
    console.error("Error fetching all cities:", error);
    return [];
  }
}

export type PopularDestination = City & {
  listingCount: number;
  imageUrl?: string;
};

/**
 * Get popular destinations based on number of published listings
 * Optimized version using raw SQL for better performance with large datasets
 * @param limit - Number of destinations to return (default: 6)
 * @param offset - Number of destinations to skip for pagination (default: 0)
 */
export async function getPopularDestinations(limit: number = 6, offset: number = 0): Promise<PopularDestination[]> {
  try {
    // Use raw SQL to aggregate at the database level instead of fetching all listings
    // This is much more efficient for large datasets
    const result = await prisma.$queryRaw<
      Array<{
        city: string;
        state: string | null;
        country: string;
        lat: number;
        lng: number;
        listing_count: bigint;
        image_url: string | null;
      }>
    >`
      SELECT 
        location->>'city' as city,
        location->>'state' as state,
        location->>'country' as country,
        CAST(location->>'lat' AS DECIMAL) as lat,
        CAST(location->>'lng' AS DECIMAL) as lng,
        COUNT(*) as listing_count,
        (array_agg(images[1]))[1] as image_url
      FROM listings
      WHERE status = 'published' 
        AND location->>'city' IS NOT NULL
        AND array_length(images, 1) > 0
      GROUP BY 
        location->>'city',
        location->>'state',
        location->>'country',
        location->>'lat',
        location->>'lng'
      ORDER BY listing_count DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const destinations: PopularDestination[] = result.map((row) => ({
      id: 0, // Temporary ID - not needed for display
      name: row.city,
      state: row.state,
      country: row.country,
      lat: Number(row.lat),
      lng: Number(row.lng),
      listingCount: Number(row.listing_count),
      imageUrl: row.image_url || undefined,
    }));

    return destinations;
  } catch (error) {
    console.error("Error fetching popular destinations:", error);
    return [];
  }
}
