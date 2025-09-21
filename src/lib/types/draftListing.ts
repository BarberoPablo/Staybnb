import { Promotion, PromotionDB } from "./listing";

export type DraftListingDB = {
  id: number;
  host_id: string;
  property_type?: "House" | "Apartment" | "Cabin" | "Boat";
  privacy_type?: "Entire" | "Private" | "Shared";
  location?: {
    lat: number;
    lng: number;
    city: string;
    state: string;
    street: string;
    country: string;
    postcode: string;
    timezone: string;
    formatted: string;
    housenumber: string;
  };
  check_in_time?: string;
  check_out_time?: string;
  title?: string;
  description?: string;
  night_price?: number;
  promotions?: PromotionDB[];
  structure?: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  guest_limits?: {
    adults: { min: number; max: number };
    children: { min: number; max: number };
    infant: { min: number; max: number };
    pets: { min: number; max: number };
  };
  amenities?: number[];
  images?: string[];
  min_cancel_days?: number;
  current_step?: number;
  visited_steps?: number[];
  created_at: string;
  updated_at: string;
};

export type DraftListing = {
  id: number;
  hostId: string;
  propertyType?: "House" | "Apartment" | "Cabin" | "Boat";
  privacyType?: "Entire" | "Private" | "Shared";
  location?: {
    lat: number;
    lng: number;
    city: string;
    state: string;
    street: string;
    country: string;
    postcode: string;
    timezone: string;
    formatted: string;
    housenumber: string;
  };
  checkInTime?: string;
  checkOutTime?: string;
  title?: string;
  description?: string;
  nightPrice?: number;
  promotions?: Promotion[];
  structure?: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  guestLimits?: {
    adults: { min: number; max: number };
    children: { min: number; max: number };
    infant: { min: number; max: number };
    pets: { min: number; max: number };
  };
  amenities?: number[];
  images?: string[];
  minCancelDays?: number;
  currentStep?: number;
  visitedSteps?: number[];
  createdAt: Date;
  updatedAt: Date;
};
