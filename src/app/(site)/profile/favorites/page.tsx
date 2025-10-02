"use client";

import { useFavoritesOptimistic } from "@/hooks/useFavoritesOptimistic";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { SearchBar } from "../components/SearchBar";
import { SkeletonFavorites } from "../components/SkeletonFavorites";
import { FavoriteCard } from "./components/FavoriteCard";

export default function FavoritesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const { favorites, loading, error, toggleFavorite } = useFavoritesOptimistic();
  const router = useRouter();

  const filteredFavorites = favorites.filter(
    (favorite) =>
      favorite.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.listing.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.listing.location?.formatted?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveFavorite = async (listingId: number) => {
    await toggleFavorite(listingId);
  };

  const handleViewListing = (listingId: number) => {
    router.push(`/listing/${listingId}`);
  };

  if (loading) {
    return <SkeletonFavorites />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Favorites" description="Your saved places and dream destinations" />
        <EmptyState icon="❤️" title="Error loading favorites" description={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Favorites" description="Your saved places and dream destinations" />

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search your favorites..." variant="default" />

      {/* Favorites Grid */}
      {filteredFavorites.length === 0 ? (
        <EmptyState
          icon="❤️"
          title={searchTerm ? "No favorites found" : "No favorites yet"}
          description={searchTerm ? "Try adjusting your search terms" : "Start exploring and save places you love"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite, index) => (
            <FavoriteCard key={favorite.id} favorite={favorite} index={index} onViewListing={handleViewListing} onRemoveFavorite={handleRemoveFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
