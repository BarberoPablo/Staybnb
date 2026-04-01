import { components } from "@/types/api";
import { z } from "zod";

type PrivacyTypes = components["schemas"]["ListingCardDto"]["privacyType"];
type PropertyTypes = components["schemas"]["ListingCardDto"]["propertyType"];
type ListingStatuses = components["schemas"]["ListingDetailsResponseDto"]["status"];

export const PRIVACY_TYPES = ["ENTIRE", "PRIVATE", "SHARED"] as const satisfies readonly PrivacyTypes[];
export const PROPERTY_TYPES = ["HOUSE", "APARTMENT", "CABIN", "BOAT"] as const satisfies readonly PropertyTypes[];
export const LISTING_STATUS = ["PUBLISHED", "PAUSED", "PENDING", "REJECTED"] as const satisfies readonly ListingStatuses[];
export const LISTING_GUESTS = ["adults", "children", "infant", "pets"] as const;

export const StructureSchema = z.object({
  bedrooms: z.number(),
  beds: z.number(),
  bathrooms: z.number(),
  guests: z.number(),
});

export const GuestLimitsSchema = z.object({
  adults: z.object({ min: z.number(), max: z.number() }),
  children: z.object({ min: z.number(), max: z.number() }),
  infant: z.object({ min: z.number(), max: z.number() }),
  pets: z.object({ min: z.number(), max: z.number() }),
});

export const PromotionSchema = z.object({
  minNights: z.number(),
  discountPercentage: z.number(),
  description: z.string(),
});

export type Promotion = z.infer<typeof PromotionSchema>;
