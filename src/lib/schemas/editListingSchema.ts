import { z } from "zod";
import { PRIVACY_TYPES, PromotionSchema, PROPERTY_TYPES } from "../api/shared/listing/listing.fragments.schema";

// Schema for editing an existing Listing. All fields are required for validation when saving changes.
export const editListingSchema = z.object({
  title: z.string().min(10, "Title must have at least 10 characters"),
  description: z.string().min(20, "Description must have at least 20 characters"),
  nightPrice: z.number().min(1, "Price must be positive"),
  propertyType: z.enum(PROPERTY_TYPES),
  privacyType: z.enum(PRIVACY_TYPES),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid check-in time (use HH:MM)"),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid check-in time (use HH:MM)"),
  minCancelDays: z.number().min(0, "Must be 0 or greater"),
  structure: z.object({
    guests: z.number().min(1, "Must be at least 1"),
    bedrooms: z.number().min(0, "Must be at least 1"),
    beds: z.number().min(0, "Must be at least 1"),
    bathrooms: z.number().min(0, "Must be at least 1"),
  }),
  guestLimits: z
    .object({
      adults: z.object({ min: z.number().min(1), max: z.number().min(0).max(50) }),
      children: z.object({ min: z.number().min(0), max: z.number().min(0).max(50) }),
      infant: z.object({ min: z.number().min(0), max: z.number().min(0).max(50) }),
      pets: z.object({ min: z.number().min(0), max: z.number().min(0).max(50) }),
    })
    .superRefine((limits, ctx) => {
      for (const [key, { min, max }] of Object.entries(limits)) {
        if (max < min) {
          ctx.addIssue({
            code: "custom",
            path: [key as keyof typeof limits, "max"],
            message: "Max must be greater than or equal to Min",
          });
        }
      }
    }),
  images: z
    .array(z.url())
    .min(5)
    .max(20)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Images must be unique and at least 5 and at most 20",
    }),
  promotions: z.array(PromotionSchema),
  location: z.object({
    lat: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
    lng: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    street: z.string().min(1, "Street is required"),
    country: z.string().min(1, "Country is required"),
    postcode: z.string().min(1, "Postcode is required"),
    timezone: z.string().min(1, "Timezone is required"),
    formatted: z.string().min(1, "Formatted address is required"),
    housenumber: z.string().min(1, "House number is required"),
  }),
  amenities: z.array(z.string()),
});

export const editListingPatchSchema = editListingSchema.partial();

export type EditListingFormValues = z.infer<typeof editListingSchema>;
export type EditListingPatchValues = z.infer<typeof editListingPatchSchema>;
