"use client";

import { pauseListing } from "@/lib/api/server/api";
import { Listing } from "@/lib/types/listing";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaMapMarkerAlt, FaPause, FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function HostListingCards({ listings }: { listings: Listing[] }) {
  const router = useRouter();

  const handleCreateListing = () => {
    router.push("/hosting/create");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  if (listings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center py-16"
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-myGreenExtraLight flex items-center justify-center">
            <FaPlus className="w-12 h-12 text-myGreenSemiBold" />
          </div>
          <h3 className="text-2xl font-bold text-myGrayDark mb-4">No listings yet</h3>
          <p className="text-myGray mb-8">Start your hosting journey by creating your first listing.</p>
          <button
            onClick={handleCreateListing}
            className="px-8 py-4 rounded-xl bg-myGreenSemiBold text-white font-semibold hover:bg-myGreenBold transition-all duration-200 hover:cursor-pointer shadow-lg hover:shadow-xl"
          >
            Create Your First Listing
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {listings.map((listing) => (
        <HostListingCard key={listing.id} listing={listing} />
      ))}
    </motion.div>
  );
}

export function HostListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [listingStatus, setListingStatus] = useState<string>(listing.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paused":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleEdit = () => {
    router.push(`/hosting/listings/edit/${listing.id}`);
  };

  const handleCompleteListing = () => {
    router.push(`/hosting/create?id=${listing.id}`);
  };

  const handlePauseListing = async () => {
    try {
      setListingStatus("paused");
      await pauseListing(listing.id);
      toast.success("Listing paused");
    } catch (error) {
      setListingStatus(listing.status);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error pausing listing");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="relative rounded-2xl shadow-lg border border-gray-300 overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={listing.images[0] + "&w=400"}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(listingStatus)}`}>{getStatusText(listingStatus)}</span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-myGrayDark text-lg mb-1 line-clamp-1">{listing.title}</h3>
          <p className="text-myGray text-sm line-clamp-2">{listing.description}</p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <FaMapMarkerAlt className="w-3 h-3 text-myGray" />
          <span className="text-xs text-myGray">
            {listing.location.city}, {listing.location.country}
          </span>
        </div>

        {/* Price and Property Type */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-myGrayDark">${listing.nightPrice}</span>
            <span className="text-myGray text-sm">/night</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-myGrayDark capitalize">{listing.propertyType.replace("_", " ")}</div>
            <div className="text-xs text-myGray capitalize">{listing.privacyType.replace("_", " ")}</div>
          </div>
        </div>

        {/* Edit Action */}
        {/* "published""draft""paused""pending"*/}
        <div className="flex gap-2 mt-4">
          {["published", "paused", "pending"].includes(listingStatus) && (
            <button
              onClick={handleEdit}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-myGreenSemiBold rounded-lg hover:bg-myGreenBold transition-colors duration-200 flex items-center justify-center gap-2 hover:cursor-pointer"
            >
              <MdEdit className="w-4 h-4" />
              Edit
            </button>
          )}

          {listingStatus === "draft" && (
            <button
              className="w-full px-4 py-3 text-sm font-medium text-white bg-myGreenSemiBold rounded-lg hover:bg-myGreenBold transition-colors duration-200 flex items-center justify-center gap-2 hover:cursor-pointer"
              onClick={handleCompleteListing}
            >
              <FaCheckCircle className="w-4 h-4" />
              Complete Listing
            </button>
          )}

          {listingStatus === "published" && (
            <button
              className="w-full px-4 py-3 text-sm font-medium text-white bg-[#E0C04F] rounded-lg hover:bg-myGreenBold transition-colors duration-200 flex items-center justify-center gap-2 hover:cursor-pointer"
              onClick={handlePauseListing}
            >
              <FaPause className="w-4 h-4" />
              Pause
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
