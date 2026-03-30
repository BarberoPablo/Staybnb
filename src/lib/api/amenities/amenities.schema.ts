import { components } from "@/types/api";
import { z } from "zod";

export type Amenity = components["schemas"]["AmenityResponseDto"];

export const AmenitySchema = z.array(
  z.object({
    id: z.string(),
    category: z.string(),
    name: z.string(),
  }),
);
