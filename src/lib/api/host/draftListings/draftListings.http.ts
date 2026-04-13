"use server";

import { cookies } from "next/headers";
import { apiClient } from "../../client";
import { DraftListing, DraftListings, DraftListingSchema, DraftListingsSchema } from "./draftListings.schema";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";

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

export async function fetchCreateDraftListing() {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.POST("/host/draft-listings", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to create draft listing");
  }

  return data;
}

export async function fetchUpdateDraftListing(id: string, data: Partial<CreateListingForm>) {
  const cookieStore = await cookies();

  const { data: responseData, error } = await apiClient.PATCH("/host/draft-listings/{id}", {
    params: {
      path: { id: id },
    },
    body: data,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to update draft listing");
  }

  return responseData;
}
