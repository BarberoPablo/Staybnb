"use server";

import { fetchGetHostListings, fetchPauseHostListing } from "@/lib/api/host/listings/listings.http";

export async function getHostListings() {
  return fetchGetHostListings();
}

export async function pauseHostListing(id: string) {
  return fetchPauseHostListing(id);
}
