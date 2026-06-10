"use server";

import { cookies } from "next/headers";
import { apiClient } from "../client";
import { CreateReservation, UnavailableDates, UnavailableDatesSchema, UserReservations, UserReservationsSchema } from "./reservations.schema";

export async function fetchListingUnavailableDates(id: string): Promise<UnavailableDates> {
  const { data, error } = await apiClient.GET("/reservations/{id}/unavailable-dates", {
    params: {
      path: { id },
    },
  });

  if (error) {
    throw new Error("Failed to fetch featured listings");
  }

  return UnavailableDatesSchema.parse(data);
}

export async function fetchCreateReservation(id: string, data: CreateReservation) {
  const cookieStore = await cookies();

  const { data: responseData, error } = await apiClient.POST("/reservations/{id}", {
    params: {
      path: { id },
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
    body: data,
  });

  if (error) {
    throw new Error(error.message);
  }

  return responseData;
}

export async function fetchUserReservations(): Promise<UserReservations> {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.GET("/reservations/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to fetch user reservations");
  }

  return UserReservationsSchema.parse(data);
}
