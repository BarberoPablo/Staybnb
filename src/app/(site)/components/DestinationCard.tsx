"use client";

import ImageWithFallback from "@/components/ImageWithFallback";
import { PopularDestination } from "@/lib/api/server/endpoints/cities";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoLocation } from "react-icons/io5";

export default function DestinationCard({ destination }: { destination: PopularDestination }) {
  const searchUrl = `/search?city=${encodeURIComponent(destination.name)}`;

  return (
    <Link href={searchUrl}>
      <motion.div
        className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0">
          {destination.imageUrl ? (
            <ImageWithFallback
              src={destination.imageUrl}
              alt={destination.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-myGreen to-myGreenBold" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <IoLocation className="w-5 h-5" />
            <h3 className="text-2xl font-bold">
              {destination.name}
              {destination.state && `, ${destination.state}`}
            </h3>
          </div>
          <p className="text-white/90 text-sm">
            {destination.listingCount} {destination.listingCount === 1 ? "property" : "properties"}
          </p>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-300" />
      </motion.div>
    </Link>
  );
}
