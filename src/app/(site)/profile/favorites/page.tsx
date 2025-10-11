import { getFavorites } from "@/lib/api/server/endpoints/favorites";
import { generateSEOMetadata } from "@/lib/seo";
import { FaHeart } from "react-icons/fa";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { FavoritesContent } from "./components/FavoritesContent";

export const metadata = generateSEOMetadata({
  title: "My Favorites",
  description: "View and manage your favorite vacation rentals.",
  noIndex: true,
});

export default async function FavoritesSection() {
  try {
    const result = await getFavorites();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to load favorites");
    }

    const favorites = result.data;

    if (favorites.length === 0) {
      return (
        <div className="space-y-6">
          <PageHeader title="My Favorites" description="Your saved places and dream destinations" />
          <EmptyState
            icon={<FaHeart className="w-8 h-8 text-red-400" />}
            title="No favorites yet"
            description="Start exploring and save places you love"
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <PageHeader title="My Favorites" description="Your saved places and dream destinations" />
        <FavoritesContent favorites={favorites} />
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Favorites" description="Your saved places and dream destinations" />
        <EmptyState
          icon={<FaHeart className="w-8 h-8 text-red-400" />}
          title="Something went wrong"
          description={error instanceof Error ? error.message : "An unexpected error occurred while loading your favorites"}
        />
      </div>
    );
  }
}
