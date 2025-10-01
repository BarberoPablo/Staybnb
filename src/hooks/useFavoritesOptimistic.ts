import { useUser } from "./useUser";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api/api";
import { FavoriteWithListing } from "@/lib/types/favorites";

export function useFavoritesOptimistic() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteWithListing[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingOperations, setPendingOperations] = useState<Set<number>>(new Set());

  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await api.getFavorites();
      setFavorites(data);
      setFavoriteIds(new Set(data.map((fav) => fav.listingId)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch favorites");
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const toggleFavorite = useCallback(
    async (listingId: number) => {
      if (!user || pendingOperations.has(listingId)) return false;

      const wasFavorite = favoriteIds.has(listingId);

      setPendingOperations((prev) => new Set([...prev, listingId]));

      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (wasFavorite) {
          newSet.delete(listingId);
        } else {
          newSet.add(listingId);
        }
        return newSet;
      });

      try {
        if (wasFavorite) {
          await api.deleteFavorite(listingId);
          setFavorites((prev) => prev.filter((fav) => fav.listingId !== listingId));
        } else {
          const newFavorite = await api.createFavorite(listingId);
          setFavorites((prev) => [newFavorite, ...prev]);
        }
        return true;
      } catch (err) {
        setFavoriteIds((prev) => {
          const newSet = new Set(prev);
          if (wasFavorite) {
            newSet.add(listingId);
          } else {
            newSet.delete(listingId);
          }
          return newSet;
        });

        setError(err instanceof Error ? err.message : "Failed to toggle favorite");
        console.error("Error toggling favorite:", err);
        return false;
      } finally {
        setPendingOperations((prev) => {
          const newSet = new Set(prev);
          newSet.delete(listingId);
          return newSet;
        });
      }
    },
    [user, favoriteIds, pendingOperations]
  );

  const isFavorite = useCallback(
    (listingId: number) => {
      return favoriteIds.has(listingId);
    },
    [favoriteIds]
  );

  const isPending = useCallback(
    (listingId: number) => {
      return pendingOperations.has(listingId);
    },
    [pendingOperations]
  );

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoriteIds(new Set());
      setPendingOperations(new Set());
      setError(null);
    }
  }, [user, fetchFavorites]);

  return {
    favorites,
    favoriteIds: Array.from(favoriteIds),
    loading,
    error,
    toggleFavorite,
    isFavorite,
    isPending,
    refetch: fetchFavorites,
  };
}
