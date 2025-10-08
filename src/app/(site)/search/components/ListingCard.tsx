"use client";

import ImagesSlider from "@/components/ImagesSlider";
import { buildQueryStringFromParams } from "@/components/Navbar";
import { Listing } from "@/lib/types/listing";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { IoLocation, IoStar } from "react-icons/io5";

export default function ListingCard({ listing, setLocateListing }: { listing: Listing; setLocateListing: (trackListing: number) => void }) {
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams.toString());

  const buildHrefWithParams = () => {
    const baseHref = `/listing/${listing.id}`;
    const params = Object.fromEntries(urlParams.entries());

    const queryString = buildQueryStringFromParams(params);

    return queryString ? `${baseHref}?${queryString}` : baseHref;
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setLocateListing(listing.id)}
      onMouseLeave={() => setLocateListing(-1)}
    >
      {/* Image Section */}
      <div className="relative">
        <ImagesSlider images={listing.images} href={buildHrefWithParams()} hoverEffect={true} containerClassName="rounded-t-xl" />

        {/* Price Badge */}
        <div className="absolute bottom-3 left-1 bg-white px-3 py-1 rounded-full shadow-md border border-gray-100">
          <span className="font-semibold text-myGrayDark">${listing.nightPrice}</span>
          <span className="text-sm text-myGray">/night</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-myGrayDark text-lg leading-tight line-clamp-2 flex-1">
            {listing.propertyType} in {listing.location.city}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 bg-myGreenExtraLight px-2 py-1 rounded-full">
            <IoStar className="w-4 h-4 text-myGreenBold fill-current" />
            <span className="text-sm font-semibold text-myGrayDark">{listing.score.value.toFixed(1)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-myGray text-sm">
          <IoLocation className="w-5 h-5" />
          <span className="line-clamp-1">{listing.location.formatted}</span>
        </div>

        {/* Price Details */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-myGray">7 nights total</span>
            <span className="font-semibold text-myGrayDark">${(listing.nightPrice * 7).toFixed(0)}</span>
          </div>
          <div className="text-xs text-myGray">${listing.nightPrice} × 7 nights</div>
        </div>
      </div>
    </motion.div>
  );
}
