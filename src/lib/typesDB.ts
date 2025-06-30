import { Guests } from "./types";

export type ListingDB = {
  id: number;
  title: string;
  description: string;
  location: string;
  night_price: number;
  promotions?: {
    min_nights: number;
    discount_percentage: number;
    description: string;
  }[];
  type: string;
  host_id: string;
  created_at: string; // ISO date string
  images: string[];
  structure: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  guest_limits: {
    adults: { min: number; max: number };
    children: { min: number; max: number };
    infant: { min: number; max: number };
    pets: { min: number; max: number };
  };
  score: {
    value: number;
    reviews: {
      message: string;
      score: number;
    }[];
  };
};

export type HostDB = {
  id: string;
  name: string;
  avatar_url: string;
};

/* export type ListingWithHostDB = ListingDB & {
  host_name: string;
  host_avatar_url: string;
}; */

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

export type CreateReservationDB = {
  user_id: string;
  listing_id: number;
  start_date: Date;
  end_date: Date;
  guests: Record<Guests, number>;
  total_price: number;
  total_nights: number;
  night_price: number;
  discount: number;
  discount_percentage: number;
};
