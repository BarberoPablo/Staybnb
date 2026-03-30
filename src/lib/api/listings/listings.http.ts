import { apiClient } from "../client";
import { MapCoordinates } from "../server/types";
import { ParsedFilters, parseFiltersToQuery } from "../server/utils";
import { CityCenter, ListingCardData, ListingCardSchema, ListingDetails, ListingDetailsSchema } from "./listings.schema";

export async function fetchFeaturedListings(limit = 12, offset = 0) {
  const { data, error } = await apiClient.GET("/listings/featured", {
    params: {
      query: { limit, offset },
    },
  });

  if (error) {
    throw new Error("Failed to fetch featured listings");
  }

  return ListingCardSchema.parse(data);
}

export async function fetchPopularListings(limit = 12, offset = 0) {
  const { data, error } = await apiClient.GET("/listings/popular", {
    params: {
      query: { limit, offset },
    },
  });

  if (error) {
    throw new Error("Failed to fetch popular listings");
  }

  return ListingCardSchema.parse(data);
}

export async function fetchSearchListings(
  filters: ParsedFilters,
  city?: string,
  mapCoordinates?: MapCoordinates,
): Promise<{ listings: ListingCardData[]; cityCenter: CityCenter }> {
  if (!city) return { listings: [], cityCenter: null };

  const query = parseFiltersToQuery(filters, city, mapCoordinates);

  const { data, error } = await apiClient.GET("/listings", {
    params: {
      query: { ...query },
    },
  });

  if (error) {
    throw new Error("Failed to search listings");
  }

  return { listings: ListingCardSchema.parse(data.listings), cityCenter: data.cityCenter ?? null };
}

export async function fetchListingDetails(id: string): Promise<ListingDetails> {
  const { data, error } = await apiClient.GET("/listings/{id}", {
    params: {
      path: { id },
    },
  });

  if (error) {
    throw new Error("Failed to search listings");
  }

  return ListingDetailsSchema.parse(data);
}
