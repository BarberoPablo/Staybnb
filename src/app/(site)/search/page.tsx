import { getAllCities } from "@/lib/api/server/endpoints/cities";
import { searchListings } from "@/lib/api/server/endpoints/listings";
import { parseFilters } from "@/lib/api/server/utils";
import { generateSEOMetadata } from "@/lib/seo";
import { SearchPageParams } from "@/lib/types";
import type { Metadata } from "next";
import SearchContainer from "./components/SearchContainer";

// Generate dynamic metadata for search pages
export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchPageParams> }): Promise<Metadata> {
  const params = await searchParams;
  const city = typeof params.city === "string" ? params.city : undefined;
  const filters = parseFilters(params);

  // Build dynamic title and description based on search parameters
  let title = "Search Vacation Rentals";
  let description = "Find and book your perfect vacation rental.";
  const keywords: string[] = ["search", "find rentals"];

  if (city) {
    title = `Vacation Rentals in ${city}`;
    description = `Discover and book amazing vacation rentals in ${city}. Browse through available properties and find your perfect accommodation.`;
    keywords.push(city, `${city} rentals`, `${city} accommodations`);
  }

  // Add filter-specific metadata
  if (filters.adults || filters.children) {
    const guests = (filters.adults || 0) + (filters.children || 0);
    description += ` Perfect for ${guests} guest${guests > 1 ? "s" : ""}.`;
    keywords.push(`${guests} guests`);
  }

  if (filters.minPrice || filters.maxPrice) {
    const priceRange =
      filters.minPrice && filters.maxPrice
        ? `$${filters.minPrice}-$${filters.maxPrice}`
        : filters.minPrice
          ? `from $${filters.minPrice}`
          : `up to $${filters.maxPrice}`;
    description += ` ${priceRange} per night.`;
    keywords.push("affordable", "budget-friendly");
  }

  // Build search path with params
  const searchPath = city ? `/search?city=${city}` : "/search";

  return generateSEOMetadata({
    title,
    description,
    keywords,
    path: searchPath,
  });
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchPageParams> }) {
  const params = await searchParams;
  const city = typeof params.city === "string" ? params.city : undefined;
  const filters = parseFilters(params);

  // Format searchParams for client components (convert arrays to single values)
  const formattedParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        formattedParams[key] = value[0] || "";
      } else {
        formattedParams[key] = value;
      }
    }
  });

  const [{ listings, cityCenter }, cities] = await Promise.all([searchListings(city, filters), getAllCities()]);

  return <SearchContainer listings={listings} city={city} cityCenter={cityCenter} cities={cities} filters={filters} searchParams={formattedParams} />;
}
