"use server";

import { cookies } from "next/headers";
import { apiClient } from "../client";
import { FavoriteListings, FavoriteListingsSchema } from "./favorites.schema";

export async function fetchFavorites(): Promise<FavoriteListings> {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.GET(`/favorites`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (error) {
    throw new Error("Failed to fetch favorite listings");
  }

  return FavoriteListingsSchema.parse(data);
}

export async function fetchIsFavorite(listingId: string): Promise<{ isFavorite: boolean }> {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.GET(`/favorites/{listingId}/check`, {
    params: { path: { listingId } },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  if (error) {
    throw new Error("Failed to fetch isFavorite status");
  }

  return { isFavorite: data.isFavorite };
}

export async function fetchCreateFavorite(listingId: string): Promise<{ success: boolean }> {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.POST(`/favorites/{listingId}`, {
    params: { path: { listingId } },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to fetch create favorite");
  }

  return { success: data.success };
}

export async function fetchDeleteFavorite(listingId: string): Promise<{ success: boolean }> {
  const cookieStore = await cookies();

  const { data, error } = await apiClient.DELETE(`/favorites/{listingId}`, {
    params: { path: { listingId } },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  if (error) {
    throw new Error("Failed to fetch delete favorite");
  }

  return { success: data.success };
}
