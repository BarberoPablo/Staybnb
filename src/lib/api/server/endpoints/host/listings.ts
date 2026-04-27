"use server";

import { fetchGetHostListing, fetchGetHostListings, fetchPauseHostListing } from "@/lib/api/host/listings/listings.http";

export async function getHostListings() {
  return fetchGetHostListings();
}

export async function getHostListing(id: string) {
  return fetchGetHostListing(id);
}

export async function pauseHostListing(id: string) {
  return fetchPauseHostListing(id);
}
