import { z } from "zod";
import { LISTING_STATUS, PRIVACY_TYPES, PROPERTY_TYPES } from "../../shared/listing/listing.fragments.schema";

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

export const HostListingsSchema = z.array(HostListingSchema);

export type HostListing = z.infer<typeof HostListingSchema>;
export type HostListings = z.infer<typeof HostListingsSchema>;
