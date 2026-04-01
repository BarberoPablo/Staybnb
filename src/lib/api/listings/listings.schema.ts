import { components } from "@/types/api";
import { z } from "zod";
import {
  GuestLimitsSchema,
  LISTING_STATUS,
  PRIVACY_TYPES,
  PromotionSchema,
  PROPERTY_TYPES,
  StructureSchema,
} from "../shared/listing/listing.fragments.schema";

export type ListingCardData = components["schemas"]["ListingCardDto"];
export type CityCenter = components["schemas"]["CityCenterDto"] | null;

// Home listing card schema
export const ListingCardSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    nightPrice: z.number(),
    images: z.array(z.string()),
    ratingAvg: z.number(),
    privacyType: z.enum(PRIVACY_TYPES),
    propertyType: z.enum(PROPERTY_TYPES),
    location: z.object({
      city: z.string(),
      state: z.string(),
      country: z.string(),
      lat: z.number(),
      lng: z.number(),
    }),
  }),
);

// Find Listing by ID:

const LocationSchema = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
  lat: z.number(),
  lng: z.number(),
});

//ok
const HostSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  avatarUrl: z.string().optional(),
});

const ReservationSchema = z.object({
  id: z.string(),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
});

//ok
const ReviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  score: z.number(),
  message: z.string(),
  imageUrl: z.string().optional(),
});

// --- Main Listing Details Schema ---
export const ListingDetailsSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  nightPrice: z.number(),
  images: z.array(z.string()),
  location: LocationSchema,
  structure: StructureSchema,
  guestLimits: GuestLimitsSchema,
  propertyType: z.enum(PROPERTY_TYPES),
  privacyType: z.enum(PRIVACY_TYPES),
  host: HostSchema,
  amenities: z.array(z.string()).optional(),
  reviews: z.array(ReviewSchema).optional(),
  promotions: z.array(PromotionSchema).optional(),
  reservations: z.array(ReservationSchema).optional(),
  ratingAvg: z.number(),
  ratingCount: z.number(),
  status: z.enum(LISTING_STATUS),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Type inference
export type ListingDetails = z.infer<typeof ListingDetailsSchema>;
export type ListingDetailsHost = z.infer<typeof HostSchema>;
export type ListingDetailsReview = z.infer<typeof ReviewSchema>;
export type ListingDetailsReservation = z.infer<typeof ReservationSchema>;
