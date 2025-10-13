"use client";

import ImageWithFallback from "@/components/ImageWithFallback";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { BsFillHouseCheckFill } from "react-icons/bs";
import { IoHome, IoLocation, IoShieldCheckmark, IoStar } from "react-icons/io5";
import { ListingData } from "./Checkout";
import DateRangeSelector from "./DateRangeSelector";

export default function ListingResume({
  listingData,
  setListingData,
}: {
  listingData: ListingData;
  setListingData: React.Dispatch<React.SetStateAction<ListingData>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openDateSelector = () => {
    setIsOpen(true);
  };

  const goToListing = () => {
    router.push(`/listing/${listingData.listing.id}`);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-myGreen rounded-full flex items-center justify-center mx-auto mb-4">
          <BsFillHouseCheckFill className="w-8 h-8 text-myGrayDark" />
        </div>
        <h1 className="text-3xl font-bold text-myGrayDark mb-2">Listing Details</h1>
        <p className="text-myGray">Resumed information about the place</p>
      </div>

      <div className="border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Listing Image and Basic Info */}
        <div className="relative">
          <ImageWithFallback
            src={listingData.listing.images[0] + "&w=480"}
            alt="listing main image"
            priority
            className="object-cover w-full h-48"
            width={400}
            height={200}
            sizes="(max-width: 640px) 100vw, 400px"
          />

          {/* Button Overlays */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <button
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-myGrayDark px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md hover:cursor-pointer"
              onClick={goToListing}
            >
              View Listing
            </button>
            <button
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-myGrayDark px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md hover:cursor-pointer"
              onClick={openDateSelector}
            >
              Edit Dates
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Listing Title and Rating */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-myGrayDark line-clamp-2">{listingData.listing.title}</h2>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-myGreenExtraLight px-2 py-1 rounded-full">
                <IoStar className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-myGrayDark">{listingData.listing.score.value.toFixed(1)}</span>
              </div>
              <span className="text-sm text-myGray">({listingData.listing.score.reviews.length} reviews)</span>
            </div>

            <div className="flex items-center gap-2 text-myGray text-sm">
              <IoLocation className="w-4 h-4" />
              <span className="line-clamp-1">{listingData.listing.location.formatted}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-myGreenExtraLight rounded-xl border border-myGreenSemiBold/20 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-myGreen rounded-full flex items-center justify-center">
                <IoHome className="w-4 h-4 text-myGrayDark" />
              </div>
              <h3 className="text-lg font-semibold text-myGrayDark">Property Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="font-semibold text-myGrayDark">{listingData.listing.propertyType}</div>
                <div className="text-myGray text-xs">Property Type</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="font-semibold text-myGrayDark">{listingData.listing.privacyType}</div>
                <div className="text-myGray text-xs">Privacy Level</div>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-myGreenExtraLight rounded-xl border border-myGreenSemiBold/20 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-myGreen rounded-full flex items-center justify-center">
                <IoShieldCheckmark className="w-4 h-4 text-myGrayDark" />
              </div>
              <h3 className="text-lg font-semibold text-myGrayDark">Cancellation Policy</h3>
            </div>

            <div className="bg-white rounded-lg p-3">
              <div className="text-sm text-myGray">
                Free cancellation up to <span className="font-semibold text-myGrayDark">{listingData.listing.minCancelDays} days</span> before check-in
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Selector Modal */}
        <DateRangeSelector
          isOpen={isOpen}
          startDate={listingData.startDate}
          endDate={listingData.endDate}
          listingId={listingData.listing.id}
          setListingData={setListingData}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
}
