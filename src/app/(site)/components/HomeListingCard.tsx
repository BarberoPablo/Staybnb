"use client";

import ImagesSlider from "@/components/ImagesSlider";
import { buildQueryStringFromParams } from "@/components/Navbar";
import { Listing } from "@/lib/types/listing";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoLocation, IoStar } from "react-icons/io5";

export default function HomeListingCard({
  listing,
  setLocateListing,
  searchParams,
}: {
  listing: Listing;
  setLocateListing?: (listingId: number) => void;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const buildHrefWithParams = () => {
    const baseHref = `/listing/${listing.id}`;

    // Convert server-side searchParams to the format expected by buildQueryStringFromParams
    const params: Record<string, string> = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          params[key] = value[0] || "";
        } else {
          params[key] = value;
        }
      }
    });

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
      onMouseEnter={() => setLocateListing?.(listing.id)}
      onMouseLeave={() => setLocateListing?.(-1)}
    >
      <div className="relative">
        <ImagesSlider images={listing.images} href={buildHrefWithParams()} hoverEffect={true} containerClassName="rounded-t-xl" />

        <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-full shadow-md border border-gray-100">
          <span className="font-semibold text-myGrayDark">${listing.nightPrice}</span>
          <span className="text-sm text-myGray">/night</span>
        </div>
      </div>

      <Link href={buildHrefWithParams()}>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-myGrayDark text-lg leading-tight line-clamp-2 flex-1">{listing.title}</h3>
            {listing.score.value > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0 bg-myGreenExtraLight px-2 py-1 rounded-full">
                <IoStar className="w-4 h-4 text-myGreenBold fill-current" />
                <span className="text-sm font-semibold text-myGrayDark">{listing.score.value.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="text-sm text-myGray">
            {listing.propertyType} • {listing.privacyType} place
          </div>

          <div className="flex items-center gap-2 text-myGray text-sm">
            <IoLocation className="w-4 h-4" />
            <span className="line-clamp-1">
              {listing.location.city}, {listing.location.state || listing.location.country}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
