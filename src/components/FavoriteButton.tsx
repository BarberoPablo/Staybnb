"use client";

import { useFavoritesOptimistic } from "@/hooks/useFavoritesOptimistic";
import { IoHeart } from "react-icons/io5";
import { RoundButton } from "./Button/RoundButton";

interface FavoriteButtonProps {
  listingId: number;
  className?: string;
  showText?: boolean;
  disabled?: boolean;
}

export function FavoriteButton({ listingId, className, showText = false, disabled = false }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isPending } = useFavoritesOptimistic();

  const handleToggle = async () => {
    if (disabled) return;
    await toggleFavorite(listingId);
  };

  const isFavorited = isFavorite(listingId);
  const pending = isPending(listingId);

  return (
    <RoundButton
      onClick={handleToggle}
      disabled={disabled || pending}
      className={`
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isFavorited ? "bg-red-100 text-red-500 hover:bg-red-200" : "bg-white text-gray-400 hover:bg-gray-100"} 
        ${className}
        `}
    >
      <IoHeart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""} ${pending ? "animate-pulse" : ""}`} />
      {showText && <span className="ml-2 text-sm font-medium">{pending ? "..." : isFavorited ? "Saved" : "Save"}</span>}
    </RoundButton>
  );
}
