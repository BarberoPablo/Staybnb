import { motion } from "framer-motion";
import Image from "next/image";
import { IoEye, IoLocation, IoStar, IoTrash } from "react-icons/io5";
import { FavoriteWithListing } from "@/lib/types/favorites";

interface FavoriteCardProps {
  favorite: FavoriteWithListing;
  onViewListing: (listingId: number) => void;
  onRemoveFavorite: (listingId: number) => void;
}

export function FavoriteCard({ favorite, onViewListing, onRemoveFavorite }: FavoriteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          priority
          src={favorite.listing.images[0] + "&w=400"}
          alt={favorite.listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="100%"
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
            <span className="font-medium text-myGrayDark">{favorite.listing.score?.value ? Number(favorite.listing.score.value).toFixed(1) : "N/A"}</span>
          </div>
          <span className="text-sm text-myGray">({favorite.listing.score?.reviews?.length || 0} reviews)</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onViewListing(favorite.listing.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-myGreenSemiBold text-background rounded-lg hover:bg-myGreen transition-colors text-sm hover:cursor-pointer"
          >
            <IoEye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => onRemoveFavorite(favorite.listing.id)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm hover:cursor-pointer"
          >
            <IoTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
