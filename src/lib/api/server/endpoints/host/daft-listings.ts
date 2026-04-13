"use server";

import { PartialUpdateDraftListing } from "@/lib/api/host/draftListings/draftListings.schema";
import { parseDraftListingToCreateListingDB } from "@/lib/parsers/draftListings";
import { prisma } from "@/lib/prisma";
import { DraftListingDB } from "@/lib/types/draftListing";
import { createClient } from "../../../../supabase/server";
import {
  fetchCreateDraftListing,
  fetchDeleteDraftListing,
  fetchDraftListing,
  fetchDraftListings,
  fetchUpdateDraftListing,
} from "../../../host/draftListings/draftListings.http";
import { NotFoundError } from "../../errors";

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

export async function completeDraftListing(id: number) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  const draftData = await prisma.draft_listings.findUnique({
    where: {
      id: id,
      host_id: user.id,
    },
  });

  if (!draftData) {
    throw new NotFoundError("Draft listing not found");
  }

  const listingData = parseDraftListingToCreateListingDB(draftData as unknown as DraftListingDB);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const newListing = await tx.listings.create({
        data: {
          host_id: user.id,
          ...listingData,
        },
      });

      if (draftData.amenities && Array.isArray(draftData.amenities) && draftData.amenities.length > 0) {
        await tx.listingAmenities.createMany({
          data: draftData.amenities.map((amenityId) => ({
            listing_id: newListing.id,
            amenity_id: amenityId,
          })),
        });
      }

      await tx.draft_listings.delete({
        where: {
          id: id,
          host_id: user.id,
        },
      });

      return newListing;
    });

    return {
      success: true,
      listingId: result.id,
    };
  } catch (error) {
    console.error("Error completing draft listing", error);
    throw new NotFoundError("Failed to complete draft listing");
  }
}

export async function deleteDraftListing(id: string) {
  return fetchDeleteDraftListing(id);
}
