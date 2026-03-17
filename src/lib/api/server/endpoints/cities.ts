"use server";

import { prisma } from "@/lib/prisma";
import { City } from "@/lib/types/cities";
import { fetchPopularDestinations } from "../../cities/cities.http";
import { PopularDestination } from "../../cities/cities.schema";

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

/**
 * Get popular destinations based on number of published listings
 * Optimized version using raw SQL for better performance with large datasets
 * @param limit - Number of destinations to return (default: 6)
 * @param offset - Number of destinations to skip for pagination (default: 0)
 */
export async function getPopularDestinations(limit: number = 6, offset: number = 0): Promise<PopularDestination[]> {
  return fetchPopularDestinations(limit, offset);
}
