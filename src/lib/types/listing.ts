import { Guests } from "../types";

export type ListingDB = {
  id: number;
  title: string;
  description: string;
  location: string;
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

export type ResumedListingDB = Pick<Listing, "id" | "title" | "images" | "location" | "type" | "promotions">;

export type Listing = {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
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

export type ResumedListing = Pick<Listing, "id" | "title" | "images" | "location" | "type" | "promotions">;
