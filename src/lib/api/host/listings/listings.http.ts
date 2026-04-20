"use server";

import { cookies } from "next/headers";
import { apiClient } from "../../client";
import { HostListingDetails, HostListingDetailsSchema, HostListings, HostListingsSchema, PartialUpdateListing } from "./listings.schema";

export async function fetchGetHostListings(): Promise<HostListings> {
  const cookieStore = await cookies();
  const { data, error } = await apiClient.GET("/host/listings", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (error) {
    throw new Error("Failed to fetch host listings");
  }
  return HostListingsSchema.parse(data);
}

export async function fetchGetHostListing(listingId: string): Promise<HostListingDetails> {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.GET("/host/listings/{id}", {
    params: {
      path: { id: listingId },
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to pause host listing");
  }

  return HostListingDetailsSchema.parse(data);
}

export async function fetchPauseHostListing(listingId: string) {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.POST("/host/listings/{id}/pause", {
    params: {
      path: { id: listingId },
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to pause host listing");
  }

  return data;
}

export async function fetchEditListing(listingId: string, listingData: PartialUpdateListing) {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.PATCH("/host/listings/{id}", {
    params: {
      path: { id: listingId },
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
    body: listingData,
  });

  if (error) {
    throw new Error("Failed to edit host listing");
  }

  return data;
}
