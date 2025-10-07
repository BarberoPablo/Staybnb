"use client";

import { createFavorite, deleteFavorite, getFavorites } from "@/lib/api/server/endpoints/favorites";
import { useUser } from "@/hooks/useUser";
import { IoHeart } from "react-icons/io5";
import { RoundButton } from "./Button/RoundButton";
import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  listingId: number;
  className?: string;
  showText?: boolean;
  disabled?: boolean;
}

export function FavoriteButton({ listingId, className, showText = false, disabled = false }: FavoriteButtonProps) {
  const { user } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if this listing is favorited
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
    if (disabled || !user || isPending) return;

    setIsPending(true);
    try {
      if (isFavorited) {
        await deleteFavorite(listingId);
        setIsFavorited(false);
      } else {
        const { success, data } = await createFavorite(listingId);
        if (success && data) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsPending(false);
    }
  };

  if (isLoading) {
    return (
      <RoundButton disabled className={`bg-white text-gray-300 ${className}`}>
        <IoHeart className="w-5 h-5" />
        {showText && <span className="ml-2 text-sm font-medium">...</span>}
      </RoundButton>
    );
  }

  return (
    <RoundButton
      onClick={handleToggle}
      disabled={disabled || isPending}
      className={`
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isFavorited ? "bg-red-100 text-red-500 hover:bg-red-200" : "bg-white text-gray-400 hover:bg-gray-100"} 
        ${className}
        `}
    >
      <IoHeart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""} ${isPending ? "animate-pulse" : ""}`} />
      {showText && <span className="ml-2 text-sm font-medium">{isPending ? "..." : isFavorited ? "Saved" : "Save"}</span>}
    </RoundButton>
  );
}
