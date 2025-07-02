import { mockReservations } from "../mockReservations";
import { parseReservationFromDB } from "../parser";
import { ReservationWithListing, ReservedDates } from "../types";
import { createClient } from "./client";
import { getListing } from "./listings";

const supabase = createClient();

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

export async function getReservedDates(listingId: number): Promise<ReservedDates[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reservedDates = mockReservations.filter((r) => r.listingId === listingId);
      if (reservedDates.length > 0) {
        resolve(reservedDates);
      } else {
        reject(new Error("No reservations found"));
      }
    }, 100);
  });
}
