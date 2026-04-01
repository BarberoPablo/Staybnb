"use server";

import { cookies } from "next/headers";
import { apiClient } from "../../client";
import { DraftListing, DraftListingSchema } from "./draftListings.schema";

export async function fetchDraftListing(listingId: string): Promise<DraftListing> {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.GET("/host/draft-listings/{id}", {
    params: {
      path: { id: listingId },
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to fetch featured listings");
  }

  return DraftListingSchema.parse(data);
}
export async function fetchDraftListings() {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.GET("/host/draft-listings", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to fetch featured listings");
  }

  return data;
}
