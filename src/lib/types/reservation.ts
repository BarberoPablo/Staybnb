import { Guests } from "../types";
import { Listing, ListingDB, ResumedListing, ResumedListingDB } from "./listing";

export type ReservationDB = {
  id: string;
  user_id: string;
  listing_id: number;
  start_date: string;
  end_date: string;
  guests: Record<Guests, number>;
  total_price: number;
  total_nights: number;
  night_price: number;
  discount: number;
  discount_percentage: number;
  created_at?: string;
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
};

export type CreateReservationDB = {
  user_id: string;
  listing_id: number;
  start_date: Date;
  end_date: Date;
  guests: Record<Guests, number>;
};

export type CreateReservation = {
  userId: string;
  listingId: number;
  startDate: Date;
  endDate: Date;
  guests: Record<Guests, number>;
};

export type ResumedReservationWithListingDB = Omit<Reservation, "listingId"> &
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
