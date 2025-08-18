import { useUser } from "./useUser";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api/api";
import { FavoriteWithListing } from "@/lib/types/favorites";

export function useFavorites() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteWithListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await api.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch favorites");
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToFavorites = useCallback(
    async (listingId: number) => {
      if (!user) return false;

      try {
        const newFavorite = await api.createFavorite(listingId);
        setFavorites((prev) => [newFavorite, ...prev]);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add to favorites");
        console.error("Error adding to favorites:", err);
        return false;
      }
    },
    [user]
  );

  const removeFromFavorites = useCallback(
    async (listingId: number) => {
      if (!user) return false;

      try {
        await api.deleteFavorite(listingId);
        setFavorites((prev) => prev.filter((fav) => fav.listingId !== listingId));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove from favorites");
        console.error("Error removing from favorites:", err);
        return false;
      }
    },
    [user]
  );

  const isFavorite = useCallback(
    (listingId: number) => {
      return favorites.some((fav) => fav.listingId === listingId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (listingId: number) => {
      if (isFavorite(listingId)) {
        return await removeFromFavorites(listingId);
      } else {
        return await addToFavorites(listingId);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setError(null);
    }
  }, [user, fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
}
