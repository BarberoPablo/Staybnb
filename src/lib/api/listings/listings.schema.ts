import { components } from "@/types/api";
import { z } from "zod";

export type HomeListing = components["schemas"]["HomeListingDto"];

type PrivacyTypes = components["schemas"]["HomeListingDto"]["privacyType"];
type PropertyTypes = components["schemas"]["HomeListingDto"]["propertyType"];

const PRIVACY_TYPES = ["ENTIRE", "PRIVATE", "SHARED"] as const satisfies readonly PrivacyTypes[];

const PROPERTY_TYPES = ["HOUSE", "APARTMENT", "CABIN", "BOAT"] as const satisfies readonly PropertyTypes[];

export const HomeListingSchema = z.array(
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
    }),
  }),
);
