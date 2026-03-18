import { apiClient } from "../client";
import { HomeListingSchema } from "./listings.schema";

export async function fetchFeaturedListings(limit = 12, offset = 0) {
  const { data, error } = await apiClient.GET("/listings/featured", {
    params: {
      query: { limit, offset },
    },
  });

  if (error) {
    throw new Error("Failed to fetch featured listings");
  }

  return HomeListingSchema.parse(data);
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

  return HomeListingSchema.parse(data);
}
