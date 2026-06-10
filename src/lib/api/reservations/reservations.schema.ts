import { components } from "@/types/api";
import { z } from "zod";

export type CreateReservation = components["schemas"]["CreateReservationDto"];

export const UnavailableDatesSchema = z.object({
  unavailableCheckInDates: z.array(z.string()),
  unavailableCheckOutDates: z.array(z.string()),
});

export type UnavailableDates = z.infer<typeof UnavailableDatesSchema>;

export const UserReservationGuestsSchema = z.object({
  adults: z.number().optional(),
  children: z.number().optional(),
  infant: z.number().optional(),
  pets: z.number().optional(),
});

export const UserReviewSchema = z.object({
  score: z.number(),
  message: z.string(),
  userId: z.string(),
});

export const UserReservationListingScoreSchema = z.object({
  value: z.number(),
  userReview: UserReviewSchema.nullable(),
});

export const UserReservationListingLocationSchema = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
  lat: z.number(),
  lng: z.number(),
  formatted: z.string(),
});

export const UserReservationListingSchema = z.object({
  id: z.string(),
  title: z.string(),
  images: z.array(z.string()),
  location: UserReservationListingLocationSchema,
  nightPrice: z.number(),
  propertyType: z.string(),
  privacyType: z.string(),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  score: UserReservationListingScoreSchema,
});

export const UserReservationsSchema = z.array(
  z.object({
    id: z.string(),
    userId: z.string(),
    listingId: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    guests: UserReservationGuestsSchema,
    totalPrice: z.number(),
    totalNights: z.number(),
    nightPrice: z.number(),
    discount: z
      .unknown()
      .nullable()
      .default(0)
      .transform(() => 0),
    discountPercentage: z
      .unknown()
      .nullable()
      .default(0)
      .transform(() => 0),
    status: z.string(),
    listing: UserReservationListingSchema,
  }),
);

export type UserReservations = z.infer<typeof UserReservationsSchema>;
export type UserReservation = z.infer<typeof UserReservationsSchema>[number];
