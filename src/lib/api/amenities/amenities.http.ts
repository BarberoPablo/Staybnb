"use server";

import { apiClient } from "../client";
import { Amenity, AmenitySchema } from "./amenities.schema";

export async function fetchAmenities(): Promise<Amenity[]> {
  const { data, error } = await apiClient.GET("/amenities");

  if (error) {
    throw new Error("Failed to fetch amenities");
  }

  return AmenitySchema.parse(data);
}
