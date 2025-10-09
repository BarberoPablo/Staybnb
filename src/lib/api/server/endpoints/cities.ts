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
 * @param limit - Number of destinations to return (default: 6)
 * @param offset - Number of destinations to skip for pagination (default: 0)
 */
export async function getPopularDestinations(limit: number = 6, offset: number = 0): Promise<PopularDestination[]> {
  try {
    const listings = await prisma.listings.findMany({
      where: {
        status: "published",
      },
      select: {
        location: true,
        images: true,
      },
    });

    // Group by city and count listings
    const cityMap = new Map<string, { count: number; lat: number; lng: number; state: string | null; country: string; imageUrl?: string }>();

    listings.forEach((listing) => {
      const location = listing.location as {
        city?: string;
        state?: string;
        country?: string;
        lat?: number;
        lng?: number;
      };

      if (location?.city) {
        const cityKey = `${location.city}-${location.state || ""}-${location.country || ""}`;
        const existing = cityMap.get(cityKey);

        if (existing) {
          existing.count++;
          // Keep first image as representative
        } else {
          cityMap.set(cityKey, {
            count: 1,
            lat: location.lat ?? 0,
            lng: location.lng ?? 0,
            state: location.state ?? null,
            country: location.country ?? "",
            imageUrl: listing.images?.[0],
          });
        }
      }
    });

    const allDestinations: PopularDestination[] = Array.from(cityMap.entries())
      .map(([cityKey, data]) => {
        const [name, state, country] = cityKey.split("-");
        return {
          id: 0, // Temporary ID
          name,
          state: state || null,
          country: country || null,
          lat: data.lat,
          lng: data.lng,
          listingCount: data.count,
          imageUrl: data.imageUrl,
        };
      })
      .sort((a, b) => b.listingCount - a.listingCount);

    const paginatedDestinations = allDestinations.slice(offset, offset + limit);

    return paginatedDestinations;
  } catch (error) {
    console.error("Error fetching popular destinations:", error);
    return [];
  }
}
