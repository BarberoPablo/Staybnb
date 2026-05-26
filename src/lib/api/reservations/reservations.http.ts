"use server";

import { apiClient } from "../client";
import { UnavailableDates, UnavailableDatesSchema } from "./reservations.schema";

export async function fetchListingUnavailableDates(id: string): Promise<UnavailableDates> {
  const { data, error } = await apiClient.GET("/reservations/{id}/unavailable-dates", {
    params: {
      path: { id },
    },
  });

  if (error) {
    throw new Error("Failed to fetch featured listings");
  }

  return UnavailableDatesSchema.parse(data);
}
