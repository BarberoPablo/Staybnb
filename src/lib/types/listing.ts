import { Guests } from "../types";
import { ReservationDate, ReservationDateDB } from "./reservation";

export type ListingDB = CreateListingDB & {
  id: number;
  host_id: string;
  created_at: string;
};

export type Listing = {
  id: number;
  hostId: string;
  createdAt: string;
  propertyType: PropertyType;
  privacyType: PrivacyType;
  title: string;
  description: string;
  location: Location;
  nightPrice: number;
  promotions: Promotion[];
  structure: Structure;
  guestLimits: {
    [key in Guests]: {
      min: number;
      max: number;
    };
  };
  score: Score;
  images: string[];
};

export type ListingWithReservationsDB = ListingDB & {
  reservations: ReservationDateDB[] | [];
};

export type ListingWithReservations = Listing & {
  reservations: ReservationDate[] | [];
};

export type ResumedListingDB = Pick<ListingDB, "id" | "title" | "images" | "location" | "property_type" | "privacy_type" | "promotions">;

export type ResumedListing = Pick<Listing, "id" | "title" | "images" | "location" | "propertyType" | "privacyType" | "promotions">;

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
  title: string;
  description: string;
  location: Location;
  night_price: number;
  promotions: PromotionDB[];
  images: string[];
  structure: Structure;
  guest_limits: {
    [key in Guests]: {
      min: number;
      max: number;
    };
  };
  amenities: string[];
  safety_items: string[];
  score: Score;
};

export type Location = {
  formatted: string;
  housenumber: string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  lat: number;
  lng: number;
  timezone: string;
};
