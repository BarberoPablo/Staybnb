import { Guests } from "../types";
import { ReservationDate, ReservationDateDB } from "./reservation";

export type ListingDB = {
  id: number;
  title: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  night_price: number;
  promotions: PromotionDB[];
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

export type Listing = {
  id: number;
  title: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  nightPrice: number;
  promotions: Promotion[];
  type: string;
  hostId: string;
  structure: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  guestLimits: {
    [key in Guests]: {
      min: number;
      max: number;
    };
  };
  score: {
    value: number;
    reviews: {
      message: string;
      score: number;
    }[];
  };
  images: string[];
};

export type ListingWithReservationsDB = ListingDB & {
  reservations: ReservationDateDB[] | [];
};

export type ListingWithReservations = Listing & {
  reservations: ReservationDate[] | [];
};

export type ResumedListingDB = Pick<Listing, "id" | "title" | "images" | "location" | "type" | "promotions">;

export type ResumedListing = Pick<Listing, "id" | "title" | "images" | "location" | "type" | "promotions">;

export type PromotionDB = {
  min_nights: number;
  discount_percentage: number;
  description: string;
};

export type Promotion = {
  minNights: number;
  discountPercentage: number;
  description: string;
};

export type PropertyType = "House" | "Apartment" | "Cabin" | "Boat";

export type PrivacyType = "Entire" | "Private" | "Shared";

export type Structure = {
  [key in "guests" | "bedrooms" | "beds" | "bathrooms"]: number;
};

export type Score = {
  value: number;
  reviews: {
    score: number;
    message: string;
    guest: string;
  }[];
};

export type CreateListingDB = {
  property_type: PropertyType;
  privacy_type: PrivacyType;
  location: string;
  lat: number;
  lng: number;
  timezone: string;
  title: string;
  description: string;
  night_price: number;
  promotions: PromotionDB[];
  images: string[];
  structure: Structure;
  guest_limits: {
    adults: { min: number; max: number };
    children: { min: number; max: number };
    infant: { min: number; max: number };
    pets: { min: number; max: number };
  };
  amenities: string[];
  safety_items: string[];
  score: Score;
};
