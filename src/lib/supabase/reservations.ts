import { Guests } from "../types";
import { supabase } from "./client";

export type Reservation = {
  user_id: string;
  listing_id: number;
  start_date: Date;
  end_date: Date;
  guests: Record<Guests, number>;
  total_price: number;
};

export async function createReservation(data: Reservation) {
  const { error, data: insertedData } = await supabase.from("reservations").insert(data).select();

  if (error) {
    console.error(error);
    throw new Error("Could not create reservation");
  }

  return insertedData;
}
