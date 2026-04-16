"use server";

import { cookies } from "next/headers";
import { apiClient } from "../../client";
import { HostListings } from "./listings.schema";

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
  return data;
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
