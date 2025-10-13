"use client";

import { deleteFavorite } from "@/lib/api/server/endpoints/favorites";
import { FavoriteWithListing } from "@/lib/types/favorites";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import { EmptyState } from "../../components/EmptyState";
import { SearchBar } from "../../components/SearchBar";
import { FavoriteCard } from "./FavoriteCard";

export function FavoritesContent({ favorites }: { favorites: FavoriteWithListing[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [optimisticFavorites, setOptimisticFavorites] = useState<FavoriteWithListing[]>([]);

  useEffect(() => {
    setOptimisticFavorites(
      favorites.filter(
        (favorite) =>
          favorite.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          favorite.listing.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          favorite.listing.location?.formatted?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, favorites]);

  const handleRemoveFavorite = async (listingId: number) => {
    const backupFavorites = optimisticFavorites;
    setOptimisticFavorites(optimisticFavorites.filter((favorite) => favorite.listing.id !== listingId));
    try {
      await deleteFavorite(listingId);
    } catch (error) {
      setOptimisticFavorites(backupFavorites);
      if (error instanceof Error) {
        toast.error(error.message, { duration: 2000 });
      } else {
        toast.error("Error at removing favorite");
      }
    }
  };

  const handleViewListing = (listingId: number) => {
    router.push(`/listing/${listingId}`);
  };

  return (
    <div className="space-y-6">
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search your favorites..." variant="default" />

      {/* Favorites Grid */}
      {optimisticFavorites.length === 0 ? (
        <EmptyState icon={<FaHeart className="w-8 h-8 text-red-400" />} title="No favorites found" description="Try adjusting your search terms" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {optimisticFavorites.map((favorite) => (
            <FavoriteCard key={favorite.id} favorite={favorite} onViewListing={handleViewListing} onRemoveFavorite={handleRemoveFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
