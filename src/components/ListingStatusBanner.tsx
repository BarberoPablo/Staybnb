"use client";

import { LISTING_STATUS_MAP } from "@/lib/api/shared/listing/listing.fragments.schema";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ListingStatusBannerProps {
  status: string;
  className?: string;
}

export default function ListingStatusBanner({ status, className = "" }: ListingStatusBannerProps) {
  const [showBanner, setShowBanner] = useState(true);

  const getStatusMessage = (status: string) => {
    switch (status) {
      case LISTING_STATUS_MAP.REJECTED:
        return "This listing is not ready for booking.";
      case LISTING_STATUS_MAP.PAUSED:
        return "This listing is currently paused and not accepting new reservations.";
      case LISTING_STATUS_MAP.PENDING:
        return "This listing is under review and not yet available for booking.";
      default:
        return "This listing is not available for booking.";
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case LISTING_STATUS_MAP.REJECTED:
        return "Listing Not Ready";
      case LISTING_STATUS_MAP.PAUSED:
        return "Listing Paused";
      case LISTING_STATUS_MAP.PENDING:
        return "Under Review";
      default:
        return "Not Available";
    }
  };

  const isListingUnavailable = status !== LISTING_STATUS_MAP.PUBLISHED;

  if (!isListingUnavailable || !showBanner) {
    return null;
  }

  return (
    <motion.div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 ${className}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <FiAlertTriangle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 text-sm">{getStatusTitle(status)}</h3>
            <p className="text-red-700 text-sm mt-1">{getStatusMessage(status)}</p>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">
            <FiX className="text-lg" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
