import { apiClient } from "../client";
import { FeaturedListingSchema } from "./listings.schema";

export async function fetchFeaturedListings(limit = 12, offset = 0) {
  const { data, error } = await apiClient.GET("/listings/featured", {
    params: {
      query: { limit, offset },
    },
  });

  if (error) {
    throw new Error("Failed to fetch featured listings");
  }

  return FeaturedListingSchema.parse(data);
}
