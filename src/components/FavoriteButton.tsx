"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { IoHeart } from "react-icons/io5";
import { RoundButton } from "./Button/RoundButton";

interface FavoriteButtonProps {
  listingId: number;
  className?: string;
  showText?: boolean;
  disabled?: boolean;
}

export function FavoriteButton({ listingId, className, showText = false, disabled = false }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, loading } = useFavorites();

  const handleToggle = async () => {
    if (disabled || loading) return;
    await toggleFavorite(listingId);
  };

  const isFavorited = isFavorite(listingId);

  return (
    <RoundButton
      onClick={handleToggle}
      disabled={disabled || loading}
      className={`
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isFavorited ? "bg-red-100 text-red-500 hover:bg-red-200" : "bg-white text-gray-400 hover:bg-gray-100"} 
        ${className}
        `}
    >
      <IoHeart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
      {showText && <span className="ml-2 text-sm font-medium">{loading ? "..." : isFavorited ? "Saved" : "Save"}</span>}
    </RoundButton>
  );
}
