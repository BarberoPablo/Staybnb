import { Guests } from "../types";
import { supabase } from "./client";

type Reservation = {
  userId: string;
  listingId: string;
  startDate: Date;
  endDate: Date;
  guests: Record<Guests, number>;
  totalPrice: number;
};

export async function createReservation(data: Reservation) {
  const { error } = await supabase.from("reservations").insert(data);
  if (error) {
    console.error(error);
    throw new Error("Could not create reservation");
  }
}
