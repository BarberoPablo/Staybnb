"use server";

import { cookies } from "next/headers";
import { apiClient } from "../../client";
import { DraftListing, DraftListings, DraftListingSchema, DraftListingsSchema } from "./draftListings.schema";

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
    throw new Error("Failed to fetch draft listing");
  }

  return DraftListingSchema.parse(data);
}
export async function fetchDraftListings(): Promise<DraftListings> {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.GET("/host/draft-listings", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to fetch draft listings");
  }

  return DraftListingsSchema.parse(data);
}

export async function fetchDeleteDraftListing(id: string) {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.DELETE("/host/draft-listings/{id}", {
    params: {
      path: { id: id },
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to delete draft listing");
  }

  return data;
}
