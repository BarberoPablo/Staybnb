import { z } from "zod";

export const editListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  nightPrice: z.number().min(0, "Price must be positive"),
  propertyType: z.enum(["House", "Apartment", "Cabin", "Boat"]),
  privacyType: z.enum(["Entire", "Private", "Shared"]),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid check-in time (use HH:MM)"),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid check-in time (use HH:MM)"),
  minCancelDays: z.number().min(0, "Must be 0 or greater"),
  structure: z.object({
    guests: z.number().min(1, "Must be at least 1"),
    bedrooms: z.number().min(1, "Must be at least 1"),
    beds: z.number().min(1, "Must be at least 1"),
    bathrooms: z.number().min(1, "Must be at least 1"),
  }),
  guestLimits: z
    .object({
      adults: z.object({ min: z.number().min(1), max: z.number().min(0) }),
      children: z.object({ min: z.number().min(0), max: z.number().min(0) }),
      infant: z.object({ min: z.number().min(0), max: z.number().min(0) }),
      pets: z.object({ min: z.number().min(0), max: z.number().min(0) }),
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
  images: z.array(z.string()),
  promotions: z.array(z.any()),
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
  amenities: z.array(z.number()),
});
