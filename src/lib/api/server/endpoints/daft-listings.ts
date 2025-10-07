"use server";

import { parseCreateListingToDB, parseDraftListingFromDB, parseDraftListingToCreateListingDB } from "@/lib/parsers/draftListings";
import { prisma } from "@/lib/prisma";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { DraftListingDB } from "@/lib/types/draftListing";
import { createClient } from "../../../supabase/server";
import { NotFoundError } from "../errors";

export async function createDraftListing() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  try {
    const existingDrafts = await prisma.draft_listings.count({
      where: {
        host_id: user.id,
      },
    });

    if (existingDrafts >= 3) {
      throw new Error("Maximum number of draft listings reached (3)");
    }

    const draftListing = await prisma.draft_listings.create({
      data: {
        host_id: user.id,
        property_type: "House",
        privacy_type: "Entire",
        title: "",
        description: "",
        night_price: 0,
        check_in_time: "15:00",
        check_out_time: "11:00",
        min_cancel_days: 3,
        promotions: [],
        images: [],
        structure: {
          guests: 1,
          bedrooms: 0,
          beds: 0,
          bathrooms: 1,
        },
        guest_limits: {
          adults: { min: 1, max: 2 },
          children: { min: 0, max: 0 },
          infant: { min: 0, max: 0 },
          pets: { min: 0, max: 0 },
        },
        location: {
          lat: 0,
          lng: 0,
          city: "",
          state: "",
          street: "",
          country: "",
          postcode: "",
          timezone: "",
          formatted: "",
          housenumber: "",
        },
        amenities: [],
        current_step: 0,
      },
    });

    return {
      id: draftListing.id,
      success: true,
    };
  } catch (error) {
    console.error("Error creating draft listing", error);
    if (error instanceof Error && error.message.includes("Maximum number")) {
      throw error;
    }
    throw new NotFoundError("Failed to create draft listing");
  }
}

export async function updateDraftListing(id: number, data: Partial<CreateListingForm>) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  try {
    const parsedData = parseCreateListingToDB(data);

    await prisma.draft_listings.update({
      where: {
        id: id,
        host_id: user.id,
      },
      data: {
        ...parsedData,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating draft listing", error);
    throw new NotFoundError("Failed to update draft listing");
  }
}

export async function getDraftListing(id?: number) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  try {
    if (id) {
      const draftListing = await prisma.draft_listings.findFirst({
        where: {
          id: id,
          host_id: user.id,
        },
      });

      if (!draftListing) {
        throw new NotFoundError("Draft listing not found");
      }

      return [parseDraftListingFromDB(draftListing as unknown as DraftListingDB)];
    } else {
      const draftListings = await prisma.draft_listings.findMany({
        where: {
          id: id,
          host_id: user.id,
        },
      });

      if (!draftListings || draftListings.length === 0) {
        return [];
      }

      return draftListings.map((draft) => parseDraftListingFromDB(draft as unknown as DraftListingDB));
    }
  } catch (error) {
    console.error("Error fetching draft listing", error);
    throw new NotFoundError("Failed to fetch draft listing");
  }
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

export async function deleteDraftListing(id: number) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  try {
    const draftListing = await prisma.draft_listings.findFirst({
      where: {
        id: id,
        host_id: user.id,
      },
    });

    if (!draftListing) {
      throw new NotFoundError("Draft listing not found or you don't have permission to delete it");
    }

    await prisma.draft_listings.delete({
      where: {
        id: id,
        host_id: user.id,
      },
    });

    return {
      success: true,
      message: "Draft listing deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting draft listing", error);
    if (error instanceof Error && error.message.includes("not found")) {
      throw error;
    }
    throw new NotFoundError("Failed to delete draft listing");
  }
}
