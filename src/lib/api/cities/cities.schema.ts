import { components } from "@/types/api";
import { z } from "zod";

export type PopularDestination = components["schemas"]["PopularDestinationDto"];

export const PopularDestinationSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    country: z.string(),
    lat: z.number(),
    lng: z.number(),
    listingCount: z.number(),
    imageUrl: z.string().optional(),
  }),
);
