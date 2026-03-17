import { apiClient } from "../client";
import { PopularDestinationSchema } from "./cities.schema";

export async function fetchPopularDestinations(limit = 6, offset = 0) {
  const { data, error } = await apiClient.GET("/cities/popular", {
    params: {
      query: { limit, offset },
    },
  });

  if (error) {
    throw new Error("Failed to fetch featured listings");
  }

  return PopularDestinationSchema.parse(data);
}
