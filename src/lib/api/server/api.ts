"use server";

import { parseAmenitiesFromDB } from "@/lib/parsers/amenities";
import { prisma } from "@/lib/prisma";
import { AmenityDB } from "@/lib/types/amenities";
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
