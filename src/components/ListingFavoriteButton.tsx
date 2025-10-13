"use client";

import { createFavorite, deleteFavorite, getFavorites } from "@/lib/api/server/endpoints/favorites";
import { useUser } from "@/hooks/useUser";
import { IoHeart } from "react-icons/io5";
import { useState, useEffect } from "react";

interface ListingFavoriteButtonProps {
  listingId: number;
  className?: string;
}

export function ListingFavoriteButton({ listingId, className = "" }: ListingFavoriteButtonProps) {
  const { user } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const { success, data } = await getFavorites();
        if (success && data) {
          const isFav = data.some((fav) => fav.listingId === listingId);
          setIsFavorited(isFav);
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavorite();
  }, [user, listingId]);

  const handleToggle = async () => {
    if (!user || isPending) return;

    const previousState = isFavorited;

    setIsFavorited(!isFavorited);
    setIsPending(true);

    try {
      if (previousState) {
        await deleteFavorite(listingId);
      } else {
        const { success, data } = await createFavorite(listingId);
        if (!success || !data) {
          throw new Error("Failed to create favorite");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setIsFavorited(previousState);
    } finally {
      setIsPending(false);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <button
        disabled
        className={`
          flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-300 
          bg-white text-gray-400 cursor-not-allowed
          ${className}
        `}
      >
        <IoHeart className="w-5 h-5" />
        <span className="text-sm font-medium">...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        flex items-center gap-2 px-2 py-2 rounded-2xl border transition-all duration-200
        disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer
        transform hover:scale-105 active:scale-95
        ${
          isFavorited
            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-sm"
            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm"
        }
        ${className}
      `}
    >
      <IoHeart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
    </button>
  );
}
