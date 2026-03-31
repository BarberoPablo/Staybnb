"use server";

import { fetchCreateFavorite, fetchDeleteFavorite, fetchFavorites, fetchIsFavorite } from "../../favorites/favorites.http";

export async function isFavorite(listingId: string): Promise<{ isFavorite: boolean }> {
  return fetchIsFavorite(listingId);
}

export async function getFavorites() {
  return fetchFavorites();
}

export async function createFavorite(listingId: string) {
  return fetchCreateFavorite(listingId);
}

export async function deleteFavorite(listingId: string) {
  return fetchDeleteFavorite(listingId);
}
