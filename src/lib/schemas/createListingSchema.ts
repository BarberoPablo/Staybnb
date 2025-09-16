import { z } from "zod";

export const createListingSchema = z.object({
  // Step 1: Property Type
  propertyType: z.enum(["House", "Apartment", "Cabin", "Boat"]).optional(),

  // Step 2: Privacy Type
  privacyType: z.enum(["Entire", "Private", "Shared"]).optional(),

  // Step 3: Location
  location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      city: z.string().min(1),
      state: z.string().min(1),
      street: z.string().min(1),
      country: z.string().min(1),
      postcode: z.string().min(1),
      timezone: z.string().min(1),
      formatted: z.string().min(1),
      housenumber: z.string().min(1),
    })
    .optional(),

  // Step 4: Structure
  structure: z
    .object({
      guests: z.number().min(1),
      bedrooms: z.number().min(0),
      beds: z.number().min(0),
      bathrooms: z.number().min(1),
    })
    .optional(),

  // Step 5: Amenities
  amenities: z.array(z.number()).optional(),

  // Step 6: Photos
  images: z.array(z.string()).optional(),

  // Step 7: Title & Description
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),

  // Step 8: Price & Promotions
  nightPrice: z.number().min(0).optional(),
  promotions: z.array(z.any()).optional(),

  // Step 9: Check-in/out times
  checkInTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  checkOutTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),

  // Additional fields
  minCancelDays: z.number().min(0).optional(),
  guestLimits: z
    .object({
      adults: z.object({ min: z.number().min(1), max: z.number().min(0) }),
      children: z.object({ min: z.number().min(0), max: z.number().min(0) }),
      infant: z.object({ min: z.number().min(0), max: z.number().min(0) }),
      pets: z.object({ min: z.number().min(0), max: z.number().min(0) }),
    })
    .optional(),
});

export type CreateListingForm = z.infer<typeof createListingSchema>;
