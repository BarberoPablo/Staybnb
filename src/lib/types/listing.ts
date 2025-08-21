import { Guests } from "../types";
import { Host, HostDB } from "./profile";
import { Reservation, ReservationDB, ReservedDate, ReservedDateDB } from "./reservation";

export type ListingDB = CreateListingDB & {
  id: number;
  host_id: string;
  created_at: string;
};

export type Listing = {
  id: number;
  hostId: string;
  createdAt: Date;
  propertyType: PropertyType;
  privacyType: PrivacyType;
  title: string;
  description: string;
  location: Location;
  checkInTime: string;
  checkOutTime: string;
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
  minCancelDays: number;
  status: ListingStatus;
};

export type ListingStatus = "draft" | "published" | "paused" | "pending";

export type ListingWithReservationsDB = ListingDB & {
  reservations: ReservedDateDB[] | [];
};

export type ListingWithReservations = Listing & {
  reservations: ReservedDate[] | [];
};

export type ListingWithReservationsAndHostDB = ListingWithReservationsDB & {
  host: HostDB;
};

export type ListingWithReservationsAndHost = ListingWithReservations & {
  host: Host;
};

export type ResumedListingDB = Pick<
  ListingDB,
  "id" | "title" | "images" | "location" | "night_price" | "property_type" | "privacy_type" | "check_in_time" | "check_out_time"
>;

export type ResumedListing = Pick<
  Listing,
  "id" | "title" | "images" | "location" | "nightPrice" | "propertyType" | "privacyType" | "checkInTime" | "checkOutTime"
>;

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
  check_in_time: string;
  check_out_time: string;
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
  min_cancel_days: number;
  status: ListingStatus;
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

export type HostListingsWithReservationsDB = ListingDB & {
  reservations: ReservationDB[] | [];
};

export type HostListingsWithReservations = Listing & {
  reservations: Reservation[] | [];
};
