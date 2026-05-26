import { z } from "zod";

export const UnavailableDatesSchema = z.object({
  unavailableCheckInDates: z.array(z.string()),
  unavailableCheckOutDates: z.array(z.string()),
});

export type UnavailableDates = z.infer<typeof UnavailableDatesSchema>;
