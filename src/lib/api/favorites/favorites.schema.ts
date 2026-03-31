import { components } from "@/types/api";
import { z } from "zod";

export type Amenity = components["schemas"]["AmenityResponseDto"];

export const FavoriteListingsSchema = z.array(
  z.object({
    listing: z.object({
      id: z.string(),
      title: z.string(),
      images: z.array(z.string()),
      nightPrice: z.number(),
      location: z.object({
        city: z.string(),
        state: z.string(),
      }),
      ratingAvg: z.number(),
      ratingCount: z.number(),
    }),
  }),
);

export type FavoriteListings = z.infer<typeof FavoriteListingsSchema>;
export type FavoriteListing = z.infer<typeof FavoriteListingsSchema>[number];
