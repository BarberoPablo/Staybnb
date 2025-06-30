import { parseCreateReservationToDB, parseReservationFromDB } from "../parser";
import { CreateReservation, ReservationWithListing } from "../types";
import { supabase } from "./client";
import { getListing } from "./listings";

export async function createReservation(data: CreateReservation) {
  const reservation = parseCreateReservationToDB(data);

  const { error, data: insertedData } = await supabase.from("reservations").insert(reservation).select();

  if (error) {
    console.error(error);
    throw new Error("Could not create reservation");
  }

  return insertedData;
}

export async function getUserReservations(user_id: string): Promise<ReservationWithListing[]> {
  const { data: reservations, error } = await supabase.from("reservations").select("*").eq("user_id", user_id).order("start_date", { ascending: false });

  if (reservations === null) {
    throw new Error("No reservations found");
  }

  const reservationsWithListing = await Promise.all(
    reservations.map(async (reservation) => {
      const listing = await getListing(reservation.listing_id);

      if (listing === null) {
        throw new Error("No reservations found");
      }
      return { ...parseReservationFromDB(reservation), listing };
    })
  );

  if (error) {
    throw error;
  }

  return reservationsWithListing;
}

/* Use when listing are in supabase instead of mockup
export async function getUserReservations({ user_id }: { user_id: string }): Promise<ReservationWithListing[]> {
  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("*, listing:listings(*)")
    .eq("user_id", user_id)
    .order("start_date", { ascending: false });

  if (error) {
    throw error;
  }
  return reservations;
} */
