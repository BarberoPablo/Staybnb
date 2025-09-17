"use server";

import { parseAmenitiesFromDB } from "@/lib/parsers/amenities";
import { parseCreateListingToDB, parseDraftListingFromDB } from "@/lib/parsers/draftListings";
import { prisma } from "@/lib/prisma";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { AmenityDB } from "@/lib/types/amenities";
import { DraftListingDB } from "@/lib/types/draftListing";
import { EditListing, ListingDB, ListingWithReservationsAndHostDB } from "@/lib/types/listing";
import { parseEditListingToDB, parseListingFromDB, parseListingWithReservationsAndHostFromDB } from "../../parsers/listing";
import { createClient } from "../../supabase/server";
import { NotFoundError, ReservationError } from "./errors";
import { ParsedFilters, buildSearchListingsWhereClause } from "./utils";

export async function getListingWithReservations(id: number) {
  const supabase = await createClient();

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*, host:profiles(first_name, last_name, avatar_url)")
    .eq("id", Number(id))
    .single();

  if (listingError || !listing) {
    throw new NotFoundError();
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: reservations, error: reservationsError } = await supabase
    .from("reservations")
    .select("start_date, end_date")
    .eq("listing_id", Number(id))
    .eq("status", "upcoming")
    .gte("end_date", today);

  if (reservationsError) {
    console.error("Error fetching reservations", reservationsError);
    throw new ReservationError();
  }

  const rawData = {
    ...listing,
    reservations: reservations || [],
  };

  return parseListingWithReservationsAndHostFromDB(rawData as ListingWithReservationsAndHostDB);
}

export async function searchListings(
  city: string | undefined,
  filters: ParsedFilters,
  mapCoordinates?: { zoom: number; northEast: { lat: number; lng: number }; southWest: { lat: number; lng: number } }
) {
  if (!city) {
    return [];
  }

  try {
    const whereClause = buildSearchListingsWhereClause(city, filters, mapCoordinates);

    const listings = await prisma.listings.findMany({
      where: whereClause,
    });

    const parsedListings = listings.map((listing) => parseListingFromDB(listing as unknown as ListingDB));

    return parsedListings;
  } catch (error) {
    console.error("Error fetching listings", error);
    throw new NotFoundError();
  }
}

export async function getHostListings() {
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
    const listings = await prisma.listings.findMany({
      where: {
        host_id: user.id,
      },
      include: { listing_amenities: { include: { amenities: true } } },
    });

    const parsedListings = listings.map((listing) => ({
      ...listing,
      amenities: parseAmenitiesFromDB(listing.listing_amenities as unknown as AmenityDB[]),
    }));

    return parsedListings.map((listing) => parseListingFromDB(listing as unknown as ListingDB));
  } catch (error) {
    console.error("Error fetching host listings", error);
    throw new NotFoundError();
  }
}

export async function getHostListing(id: number) {
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
    const listing = await prisma.listings.findUnique({
      where: {
        id: id,
        host_id: user.id,
      },
      include: { listing_amenities: { include: { amenities: true } } },
    });

    const parsedListing = parseListingFromDB(listing as unknown as ListingDB);

    return {
      ...parsedListing,
      amenities: parseAmenitiesFromDB(listing?.listing_amenities as unknown as AmenityDB[]),
    };
  } catch (error) {
    console.error("Error fetching host listings", error);
    throw new NotFoundError();
  }
}

export async function editListing(id: number, props: EditListing) {
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
    const dbData = parseEditListingToDB(props);
    const { amenities, ...listingData } = dbData;

    let validAmenities: number[] = [];
    if (amenities && amenities.length > 0) {
      const existingAmenities = await prisma.amenities.findMany({
        where: { id: { in: amenities } },
        select: { id: true },
      });
      validAmenities = existingAmenities.map((a) => a.id);
    }

    await prisma.$transaction([
      prisma.listings.update({
        where: {
          id,
          host_id: user.id,
        },
        data: listingData,
      }),

      prisma.listingAmenities.deleteMany({
        where: { listing_id: id },
      }),

      ...(validAmenities.length > 0
        ? [
            prisma.listingAmenities.createMany({
              data: validAmenities.map((amenityId) => ({
                listing_id: id,
                amenity_id: amenityId,
              })),
            }),
          ]
        : []),
    ]);

    return;
  } catch (error) {
    console.error("Error updating listing", error);
    throw new NotFoundError();
  }
}

export async function pauseListing(id: number) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    console.error("Auth error:", authErr, user);
    throw new NotFoundError();
  }

  const { data, error } = await supabase
    .from("listings")
    .update({ status: "paused" })
    .eq("host_id", user.id)
    .eq("id", id)
    .eq("status", "published")
    .select();

  if (error) {
    console.error("Error pausing listing", error);
    throw new NotFoundError("Error pausing listing");
  }

  if (!data || data.length === 0) {
    throw new NotFoundError("Could not pause listing");
  }
}

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

    if (existingDrafts >= 5) {
      throw new Error("Maximum number of draft listings reached (5)");
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
    const existingDraft = await prisma.draft_listings.findFirst({
      where: {
        id: id,
        host_id: user.id,
      },
    });

    if (!existingDraft) {
      throw new NotFoundError("Draft listing not found");
    }

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

/* export async function completeDraftListing(id: number) {
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
    const draftData = await prisma.draft_listings.findFirst({
      where: {
        id: id,
        host_id: user.id,
      },
    });

    if (!draftData) {
      throw new NotFoundError("Draft listing not found");
    }

    const newListing = await prisma.listings.create({
      data: {
        host_id: user.id,
        status: "pending",
        property_type: draftData.property_type,
        privacy_type: draftData.privacy_type,
        title: draftData.title,
        description: draftData.description,
        night_price: draftData.night_price,
        check_in_time: draftData.check_in_time,
        check_out_time: draftData.check_out_time,
        min_cancel_days: draftData.min_cancel_days,
        promotions: draftData.promotions,
        images: draftData.images,
        structure: draftData.structure,
        guest_limits: draftData.guest_limits,
        location: draftData.location,
        amenities: draftData.amenities,
        safety_items: [],
        score: {
          value: 0,
          reviews: [],
        },
      },
    });

    await prisma.draft_listings.delete({
      where: {
        id: id,
        host_id: user.id,
      },
    });

    return {
      success: true,
      listingId: newListing.id,
    };
  } catch (error) {
    console.error("Error completing draft listing", error);
    throw new NotFoundError("Failed to complete draft listing");
  }
} */
