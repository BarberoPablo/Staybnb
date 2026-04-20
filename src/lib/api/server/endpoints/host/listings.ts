"use server";

import { fetchEditListing, fetchGetHostListing, fetchGetHostListings, fetchPauseHostListing } from "@/lib/api/host/listings/listings.http";
import { PartialUpdateListing } from "@/lib/api/host/listings/listings.schema";

export async function getHostListings() {
  return fetchGetHostListings();
}

export async function getHostListing(id: string) {
  return fetchGetHostListing(id);
}

export async function pauseHostListing(id: string) {
  return fetchPauseHostListing(id);
}

/**
 * Updates a listing using a PATCH request.
 *
 * @param id - Listing identifier
 * @param props - Payload typed as `PartialUpdateListing` (OpenAPI generated type)
 *
 * NOTE:
 * Although `props` is typed using OpenAPI types, the payload is validated
 * beforehand with a Zod schema in the caller.
 *
 * A type cast (`as PartialUpdateListing`) is intentionally used at the call site
 * after validation. TypeScript cannot verify deep equivalence between:
 * - runtime validation schemas (Zod)
 * - compile-time generated types (OpenAPI / DTO)
 *
 * This is a conscious trade-off: Zod handles runtime validation,
 * while OpenAPI defines the API contract.
 */
export async function editListing(id: string, props: PartialUpdateListing) {
  return fetchEditListing(id, props);
}
