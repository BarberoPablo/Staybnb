"use server";

import { PartialUpdateDraftListing } from "@/lib/api/host/draftListings/draftListings.schema";
import {
  fetchCompleteDraftListing,
  fetchCreateDraftListing,
  fetchDeleteDraftListing,
  fetchDraftListing,
  fetchDraftListings,
  fetchUpdateDraftListing,
} from "../../../host/draftListings/draftListings.http";

export async function createDraftListing() {
  return fetchCreateDraftListing();
}

export async function updateDraftListing(id: string, data: PartialUpdateDraftListing) {
  return fetchUpdateDraftListing(id, data);
}

export async function getDraftListing(listingId: string) {
  return fetchDraftListing(listingId);
}

export async function getDraftListings() {
  return fetchDraftListings();
}

export async function completeDraftListing(id: string) {
  return fetchCompleteDraftListing(id);
}

export async function deleteDraftListing(id: string) {
  return fetchDeleteDraftListing(id);
}
