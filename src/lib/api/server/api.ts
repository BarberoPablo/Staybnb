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
    });

    return parseListingFromDB(listing as unknown as ListingDB);
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

    const updatedListing = await prisma.listings.update({
      where: {
        id: id,
        host_id: user.id,
      },
      data: dbData,
    });

    const parsedListing = parseListingFromDB(updatedListing as unknown as ListingDB);

    return parsedListing;
  } catch (error) {
    console.error("Error updating listing", error);
    throw new NotFoundError();
  }
}
