"use client";

import { RoundButton } from "@/components/Button/RoundButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import ImagesSlider from "@/components/ImagesSlider";
import { Listing } from "@/lib/types/listing";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoStar } from "react-icons/io5";

export default function ListingCard({ listing, setLocateListing }: { listing: Listing; setLocateListing: (listingId: number) => void }) {
  const [locatingListing, setLocatingListing] = useState(-1);

  const handleLocateListing = (listingId: number) => {
    setLocateListing(listingId);
    setLocatingListing(listingId);
  };

  return (
    <div className="flex flex-col shadow-sm border border-gray-200 rounded-xl gap-2 pb-2">
      <div className="relative rounded-xl">
        <ImagesSlider images={listing.images} href={`/listing/${listing.id}`} hoverEffect={true} containerClassName="rounded-b-none" />

        <div className="absolute flex top-3 right-3 gap-1">
          <FavoriteButton listingId={listing.id} />
          <RoundButton
            className={`text-xl ${
              locatingListing === listing.id ? "text-myGreenBold" : "text-myGray"
            } bg-myGreen hover:myGreen transition-colors duration-200 shadow-sm`}
            onClick={() => handleLocateListing(listing.id)}
          >
            <FaLocationDot />
          </RoundButton>
        </div>
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
