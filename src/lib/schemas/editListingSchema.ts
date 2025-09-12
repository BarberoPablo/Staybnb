import { z } from "zod";

export const editListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  nightPrice: z.number().min(0, "Price must be positive"),
  propertyType: z.enum(["House", "Apartment", "Cabin", "Boat"]),
  privacyType: z.enum(["Entire", "Private", "Shared"]),
  checkInTime: z.string(),
  checkOutTime: z.string(),
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
  location: z.any(),
  amenities: z.array(z.number()),
});
