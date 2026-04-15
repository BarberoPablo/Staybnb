"use server";

import { fetchGetHostListings } from "@/lib/api/host/listings/listings.http";

export async function getHostListings() {
  return fetchGetHostListings();
}
