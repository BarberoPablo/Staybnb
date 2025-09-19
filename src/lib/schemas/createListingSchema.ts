import { z } from "zod";

// Main schema with required fields for validation
export const createListingSchema = z.object({
  propertyType: z.enum(["House", "Apartment", "Cabin", "Boat"], {
    message: "Please select a property type to continue",
  }),
  privacyType: z.enum(["Entire", "Private", "Shared"], {
    message: "Please select a privacy type to continue",
  }),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    street: z.string().min(1, "Street is required"),
    country: z.string().min(1, "Country is required"),
    postcode: z.string().min(1, "Postcode is required"),
    timezone: z.string().min(1, "Timezone is required"),
    formatted: z.string().min(1, "Formatted address is required"),
    housenumber: z.string().min(1, "Housenumber is required"),
  }),
  structure: z.object({
    guests: z.number().min(1),
    bedrooms: z.number().min(0),
    beds: z.number().min(0),
    bathrooms: z.number().min(0),
  }),
  amenities: z.array(z.number()),
  images: z.array(z.string()).min(3, "At least three images are required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  nightPrice: z.number().min(0, "Price must be positive"),
  promotions: z.array(z.any()),
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  minCancelDays: z.number().min(0),
  guestLimits: z.object({
    adults: z.object({ min: z.number().min(1), max: z.number().min(0) }),
    children: z.object({ min: z.number().min(0), max: z.number().min(0) }),
    infant: z.object({ min: z.number().min(0), max: z.number().min(0) }),
    pets: z.object({ min: z.number().min(0), max: z.number().min(0) }),
  }),
  currentStep: z.number().min(0),
  visitedSteps: z.array(z.number()).optional(),
});

// Partial schema for initialization (everything optional)
export const createListingInitSchema = createListingSchema.partial();

export type CreateListingForm = z.infer<typeof createListingSchema>;
export type CreateListingInitForm = z.infer<typeof createListingInitSchema>;
