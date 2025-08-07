"use client";

import { Listing } from "@/lib/types/listing";
import { useState } from "react";
import { IoHeart, IoHeartOutline, IoStar } from "react-icons/io5";
import ImagesSlider from "./ImagesSlider";

export default function ListingCard({ listing }: { listing: Listing }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="flex flex-col shadow-sm border border-gray-200 rounded-xl gap-2 pb-2">
      <div className="relative rounded-xl">
        <ImagesSlider images={listing.images} href={`/listing/${listing.id}`} hoverEffect={true} containerClassName="rounded-b-none" />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 shadow-sm"
        >
          {isFavorite ? <IoHeart className="w-4 h-4 text-red-500" /> : <IoHeartOutline className="w-4 h-4 text-myGrayDark" />}
        </button>
      </div>

      <div className="px-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold truncate pr-2">
            {listing.propertyType} in {listing.location.city}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <IoStar className="" />
            <span className="text-sm font-medium text-myGrayDark">
              {listing.score.value} ({listing.score.reviews.length})
            </span>
          </div>
        </div>
        <div className="text-sm">
          <span className="font-semibold">${listing.nightPrice}</span> per night
        </div>
        <div className="text-sm">${listing.nightPrice * 7} total for 7 nights</div>
      </div>
    </div>
  );
}
