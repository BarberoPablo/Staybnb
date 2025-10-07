"use client";

import ImageWithFallback from "@/components/ImageWithFallback";
import { ListingFavoriteButton } from "@/components/ListingFavoriteButton";
import { ListBadges } from "@/components/ListBadges";
import AmenityIcon from "@/components/icons/AmenityIcon";
import { AMENITIES } from "@/lib/constants/amenities";
import { Listing, ListingWithReservationsAndHost } from "@/lib/types/listing";
import { Host } from "@/lib/types/profile";
import { motion } from "framer-motion";
import { CiUser } from "react-icons/ci";
import { IoLocation, IoStar } from "react-icons/io5";

export default function ListingDetails({ listing }: { listing: ListingWithReservationsAndHost }) {
  return (
    <motion.div
      className="relative lg:col-span-7 space-y-8 border border-gray-200 rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <ListingFavoriteButton listingId={listing.id} className="absolute top-2 right-2" />
        <h1 className="text-4xl font-bold text-myGrayDark leading-tight flex-1">{listing.title}</h1>

        <ListingSubtitle listingDetails={listing} />
      </div>

      <div className="border-t border-gray-200"></div>

      <HostInformation host={listing.host} />

      <div className="border-t border-gray-200" />

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-myGrayDark">About this place</h3>
        <p className="text-myGray leading-relaxed text-lg">{listing.description}</p>
      </div>

      <div className="border-t border-gray-200" />

      <AmenitiesSection amenities={listing.amenities} />

      <div className="border-t border-gray-200" />

      <ReviewsSection reviews={listing.score.reviews} />

      <div className="border-t border-gray-200" />
    </motion.div>
  );
}

function HostInformation({ host }: { host: Host }) {
  return (
    <div className="flex items-center">
      <ImageWithFallback
        src={host.avatarUrl}
        alt="Host image"
        height={40}
        width={40}
        className="object-cover rounded-full border border-gray-200 w-11 h-11 overflow-hidden bg-myGrayLight"
        fallbackIcon={
          <div className="bg-myGreenLight rounded-full border-2 border-myGreenBold">
            <CiUser className="w-10 h-10 text-myGreenBold" />
          </div>
        }
      />
      <h3 className="text-myGrayDark ml-2">Hosted by: {host.firstName}</h3>
    </div>
  );
}

function ListingSubtitle({ listingDetails }: { listingDetails: Listing }) {
  return (
    <div className="space-y-4">
      {/* Property Type and Location */}
      <div className="flex items-center gap-2 text-lg text-myGray">
        <IoLocation className="w-5 h-5" />
        <h2 className="font-medium">
          {listingDetails.propertyType} in {listingDetails.location.city}
        </h2>
      </div>

      {/* Structure Badges */}
      <div>
        <ListBadges badges={listingDetails.structure} className="text-base" />
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-myGreenExtraLight px-3 py-1.5 rounded-full">
          <IoStar className="w-4 h-4 text-myGreenBold fill-current" />
          <span className="text-sm font-semibold text-myGrayDark">{listingDetails.score.value.toFixed(1)}</span>
        </div>
        <span className="text-myGray font-medium underline">{listingDetails.score.reviews.length} reviews</span>
      </div>
    </div>
  );
}

function AmenitiesSection({ amenities }: { amenities: number[] }) {
  const amenityObjects = amenities
    .map((id) => AMENITIES.find((amenity) => amenity.id === id))
    .filter((amenity): amenity is NonNullable<typeof amenity> => amenity !== undefined);

  const amenitiesByCategory = amenityObjects.reduce(
    (acc, amenity) => {
      const category = amenity.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(amenity);
      return acc;
    },
    {} as Record<string, typeof amenityObjects>,
  );

  const categoryLabels: Record<string, string> = {
    general: "Essentials",
    kitchen: "Kitchen",
    dining: "Dining",
    bedroom: "Bedroom",
    bathroom: "Bathroom",
    entertainment: "Entertainment",
    security: "Security",
    activities: "Activities",
  };

  if (amenityObjects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-myGrayDark">What this place offers</h3>
        <span className="text-sm text-myGray bg-myGrayLight px-3 py-1 rounded-full">
          {amenityObjects.length} amenit{amenityObjects.length !== 1 ? "ies" : "y"}
        </span>
      </div>

      <div className="space-y-6">
        {Object.entries(amenitiesByCategory).map(([category, categoryAmenities]) => (
          <motion.div
            key={category}
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-myGrayDark border-b border-gray-100 pb-2">{categoryLabels[category] || category}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryAmenities.map((amenity) => (
                <motion.div
                  key={amenity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-myGreenExtraLight/30 border border-myGreenLight/50 hover:bg-myGreenExtraLight/50 transition-all duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-myGreenLight rounded-lg flex items-center justify-center">
                    <AmenityIcon icon={amenity.icon} className="w-4 h-4 text-myGreenBold" />
                  </div>
                  <span className="text-myGrayDark font-medium text-sm">{amenity.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReviewsSection({ reviews }: { reviews: { score: number; message: string; userId: string }[] }) {
  const topReviews = reviews.sort((a, b) => b.score - a.score).slice(0, 3);

  if (topReviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-myGrayDark">What guests are saying</h3>
        <span className="text-sm text-myGray bg-myGrayLight px-3 py-1 rounded-full">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-4">
        {topReviews.map((review, index) => (
          <motion.div
            key={`${review.userId}-${index}`}
            className="bg-gradient-to-r from-myGreenExtraLight/20 to-myGreenLight/10 border border-myGreenLight/30 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-myGreenLight to-myGreenBold rounded-full flex items-center justify-center">
                <CiUser className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <IoStar key={i} className={`w-4 h-4 ${i < review.score ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-myGrayDark">{review.score}.0</span>
                </div>

                <p className="text-myGray leading-relaxed text-base">{review.message}</p>

                <div className="flex items-center gap-2 text-sm text-myGray">
                  <span className="font-medium">Guest</span>
                  <span>•</span>
                  <span>Verified stay</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
