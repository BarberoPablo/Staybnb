import { components } from "@/types/api";
import { z } from "zod";
import { GuestLimitsSchema, PRIVACY_TYPES, PromotionSchema, PROPERTY_TYPES, StructureSchema } from "../../shared/listing/listing.fragments.schema";

export type PartialUpdateDraftListing = components["schemas"]["PartialUpdateDraftListingDto"];

export const DraftListingSchema = z.object({
  id: z.string(),
  hostId: z.string(),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  privacyType: z.enum(PRIVACY_TYPES).optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      city: z.string(),
      state: z.string(),
      street: z.string(),
      country: z.string(),
      postcode: z.string(),
      timezone: z.string(),
      formatted: z.string(),
      housenumber: z.string(),
    })
    .optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  nightPrice: z.number().optional(),
  promotions: z.array(PromotionSchema).optional(),
  structure: StructureSchema.optional(),
  guestLimits: GuestLimitsSchema.optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  minCancelDays: z.number().optional(),
  currentStep: z.number().optional(),
  visitedSteps: z.array(z.number()).optional(),
  createdAt: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  updatedAt: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
});

export const DraftListingsSchema = z.array(DraftListingSchema);

export type DraftListing = z.infer<typeof DraftListingSchema>;
export type DraftListings = z.infer<typeof DraftListingsSchema>;
