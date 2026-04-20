import { components } from "@/types/api";
import { z } from "zod";
import {
  GuestLimitsSchema,
  LISTING_STATUS,
  PRIVACY_TYPES,
  PromotionSchema,
  PROPERTY_TYPES,
  StructureSchema,
} from "../../shared/listing/listing.fragments.schema";

export type PartialUpdateListing = components["schemas"]["PartialUpdateListingDto"];

export const HostListingSchema = z.object({
  id: z.string(),
  status: z.enum(LISTING_STATUS),
  images: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  location: z.object({
    city: z.string(),
    country: z.string(),
  }),
  nightPrice: z.number(),
  propertyType: z.enum(PROPERTY_TYPES),
  privacyType: z.enum(PRIVACY_TYPES),
});

export const HostListingDetailsSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  nightPrice: z.number(),
  propertyType: z.enum(PROPERTY_TYPES),
  privacyType: z.enum(PRIVACY_TYPES),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  minCancelDays: z.number(),
  images: z.array(z.string()),
  promotions: z.array(PromotionSchema),
  structure: StructureSchema,
  guestLimits: GuestLimitsSchema,
  amenities: z.array(z.string()),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    city: z.string(),
    country: z.string(),
    state: z.string(),
    street: z.string(),
    housenumber: z.string(),
    postcode: z.string(),
    formatted: z.string(),
    timezone: z.string(),
  }),
});

export const HostListingsSchema = z.array(HostListingSchema);

export type HostListing = z.infer<typeof HostListingSchema>;
export type HostListings = z.infer<typeof HostListingsSchema>;

export type HostListingDetails = z.infer<typeof HostListingDetailsSchema>;
