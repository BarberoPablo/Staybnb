import { Guests } from "../types";
import { Listing, ListingDB, ResumedListing, ResumedListingDB } from "./listing";

export type ReservationDB = {
  id: string;
  user_id: string;
  listing_id: number;
  start_date: string; //timestamptz
  end_date: string; //timestamptz
  guests: Record<Guests, number>;
  total_price: number;
  total_nights: number;
  night_price: number;
  discount: number;
  discount_percentage: number;
  created_at: string;
  status: ReservationStatusDB;
};

export type Reservation = {
  id: string;
  userId: string;
  listingId: number;
  startDate: Date;
  endDate: Date;
  guests: Record<Guests, number>;
  totalPrice: number;
  totalNights: number;
  nightPrice: number;
  discount: number;
  discountPercentage: number;
  createdAt: Date;
  status: ReservationStatus;
};

export type ReservationStatusDB = "upcoming" | "completed" | "canceled" | "canceled_by_host";

export type ReservationStatus = "upcoming" | "completed" | "canceled" | "canceledByHost";

export type CreateReservationDB = {
  listing_id: number;
  start_date: Date;
  end_date: Date;
  guests: Record<Guests, number>;
};

export type CreateReservation = {
  listingId: number;
  startDate: Date;
  endDate: Date;
  guests: Record<Guests, number>;
};

export type ResumedReservationWithListingDB = Omit<ReservationDB, "listingId"> &
  ReservationDB & {
    listing: ResumedListingDB;
  };

export type ResumedReservationWithListing = Reservation & {
  listing: ResumedListing;
};
export type ReservationWithListingDB = Omit<Reservation, "listingId"> &
  ReservationDB & {
    listing: ListingDB;
  };

export type ReservationWithListing = Reservation & {
  listing: Listing;
};

export type ReservedDateDB = {
  start_date: string;
  end_date: string;
};

export type ReservedDate = {
  startDate: Date;
  endDate: Date;
};

export type ListingReservedDatesDB = {
  reservations: { start_date: Date; end_date: Date }[] | [];
  listing: { check_in_time: string; check_out_time: string; timezone: string };
};

export type ListingReservedDates = {
  reservations: { startDate: Date; endDate: Date }[] | [];
  listing: { checkInTime: string; checkOutTime: string; timezone: string };
};
