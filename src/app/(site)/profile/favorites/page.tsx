"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoEye, IoLocation, IoSearch, IoStar, IoTrash } from "react-icons/io5";

export default function FavoritesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const { favorites, loading, error, removeFromFavorites } = useFavorites();
  const router = useRouter();
  const filteredFavorites = favorites.filter(
    (favorite) =>
      favorite.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.listing.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.listing.location?.formatted?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveFavorite = async (listingId: number) => {
    await removeFromFavorites(listingId);
  };

  const handleViewListing = (listingId: number) => {
    router.push(`/listing/${listingId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-myGrayDark">My Favorites</h1>
          <p className="text-myGray mt-2">Your saved places and dream destinations</p>
        </div>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myGreenBold mx-auto"></div>
          <p className="text-myGray mt-4">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-myGrayDark">My Favorites</h1>
          <p className="text-myGray mt-2">Your saved places and dream destinations</p>
        </div>
        <div className="text-center py-16">
          <div className="w-20 h-20 text-red-300 mx-auto mb-4">❤️</div>
          <h3 className="text-xl font-medium text-gray-500 mb-2">Error loading favorites</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-myGrayDark">My Favorites</h1>
        <p className="text-myGray mt-2">Your saved places and dream destinations</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-myGray w-5 h-5" />
        <input
          type="text"
          placeholder="Search your favorites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
        />
      </div>

      {/* Favorites Grid */}
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 text-gray-300 mx-auto mb-4">❤️</div>
          <h3 className="text-xl font-medium text-gray-500 mb-2">{searchTerm ? "No favorites found" : "No favorites yet"}</h3>
          <p className="text-gray-400">{searchTerm ? "Try adjusting your search terms" : "Start exploring and save places you love"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite, index) => (
            <motion.div
              key={favorite.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={favorite.listing.images[0] || "/placeholder-image.jpg"}
                  alt={favorite.listing.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Price */}
                <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="font-semibold text-myGrayDark">${favorite.listing.nightPrice}</span>
                  <span className="text-sm text-myGray">/night</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-myGrayDark text-lg mb-1 line-clamp-1">{favorite.listing.title}</h3>
                  <div className="flex items-center gap-1 text-myGray text-sm">
                    <IoLocation className="w-4 h-4" />
                    {favorite.listing.location?.city || favorite.listing.location?.formatted || "Location not available"}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <IoStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-myGrayDark">
                      {favorite.listing.score?.value ? Number(favorite.listing.score.value).toFixed(1) : "N/A"}
                    </span>
                  </div>
                  <span className="text-sm text-myGray">({favorite.listing.score?.reviews?.length || 0} reviews)</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleViewListing(favorite.listing.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-myGreenBold text-background rounded-lg hover:bg-myGreenDark transition-colors text-sm hover:cursor-pointer"
                  >
                    <IoEye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.listing.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm hover:cursor-pointer"
                  >
                    <IoTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      {favorites.length > 0 && (
        <motion.div
          className="bg-myGreenLight rounded-xl p-6 border border-myGreenBold/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-myGrayDark">Favorites Summary</h3>
              <p className="text-myGray text-sm">Keep track of your saved places</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-myGrayDark">{favorites.length}</div>
              <div className="text-sm text-myGray">Total Favorites</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
