"use server";

import { prisma } from "@/lib/prisma";
import { ListingDB, ListingWithReservationsAndHostDB } from "@/lib/types/listing";
import { parseListingFromDB, parseListingWithReservationsAndHostFromDB } from "../../parsers/listing";
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

export async function searchListings(city: string | undefined, filters: ParsedFilters) {
  if (!city) {
    return [];
  }

  try {
    const whereClause = buildSearchListingsWhereClause(city, filters);

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
