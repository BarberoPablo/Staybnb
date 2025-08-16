"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { IoEye, IoHeart, IoLocation, IoSearch, IoStar, IoTrash } from "react-icons/io5";

// Mock data - replace with actual data from your API
const mockFavorites = [
  {
    id: "1",
    title: "Luxury Beach House",
    location: "Malibu, CA",
    price: 450,
    rating: 4.9,
    reviewCount: 127,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Mountain Retreat",
    location: "Aspen, CO",
    price: 320,
    rating: 4.8,
    reviewCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Urban Penthouse",
    location: "New York, NY",
    price: 280,
    rating: 4.7,
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7c65?w=400&h=300&fit=crop",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Desert Oasis",
    location: "Palm Springs, CA",
    price: 380,
    rating: 4.6,
    reviewCount: 73,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    isFavorite: true,
  },
];

export default function FavoritesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(mockFavorites);

  const filteredFavorites = favorites.filter(
    (favorite) => favorite.title.toLowerCase().includes(searchTerm.toLowerCase()) || favorite.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(favorites.map((fav) => (fav.id === id ? { ...fav, isFavorite: !fav.isFavorite } : fav)));
  };

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
          <IoHeart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
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
                  src={favorite.imageUrl}
                  alt={favorite.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(favorite.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-all duration-200"
                >
                  <IoHeart className={`w-5 h-5 ${favorite.isFavorite ? "text-red-500 fill-current" : "text-gray-400"}`} />
                </button>

                {/* Price */}
                <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="font-semibold text-myGrayDark">${favorite.price}</span>
                  <span className="text-sm text-myGray">/night</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-myGrayDark text-lg mb-1 line-clamp-1">{favorite.title}</h3>
                  <div className="flex items-center gap-1 text-myGray text-sm">
                    <IoLocation className="w-4 h-4" />
                    {favorite.location}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <IoStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-myGrayDark">{favorite.rating}</span>
                  </div>
                  <span className="text-sm text-myGray">({favorite.reviewCount} reviews)</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-myGreenBold text-background rounded-lg hover:bg-myGreenDark transition-colors text-sm">
                    <IoEye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
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
