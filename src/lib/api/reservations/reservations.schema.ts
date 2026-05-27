import { components } from "@/types/api";
import { z } from "zod";

export type CreateReservation = components["schemas"]["CreateReservationDto"];

export const UnavailableDatesSchema = z.object({
  unavailableCheckInDates: z.array(z.string()),
  unavailableCheckOutDates: z.array(z.string()),
});

export type UnavailableDates = z.infer<typeof UnavailableDatesSchema>;
