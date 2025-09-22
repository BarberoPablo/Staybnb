"use client";

import { Listing } from "@/lib/types/listing";
import { Reservation } from "@/lib/types/reservation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FaChevronDown, FaChevronUp, FaMapMarkerAlt } from "react-icons/fa";
import ReservationsTable from "./ReservationsTable";

interface HostListingReservationsCardProps {
  listing: Listing;
  reservations: Reservation[];
}

export default function HostListingReservationsCard({ listing, reservations }: HostListingReservationsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { upcomingCount, completedCount, canceledCount } = useMemo(() => {
    let upcoming = 0;
    let completed = 0;
    let canceled = 0;

    for (const r of reservations) {
      if (r.status === "upcoming") {
        upcoming++;
      } else if (r.status === "completed") {
        completed++;
      } else if (r.status === "canceled" || r.status === "canceledByHost") {
        canceled++;
      }
    }

    return { upcomingCount: upcoming, completedCount: completed, canceledCount: canceled };
  }, [reservations]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/60 rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 flex-1 min-w-0">
            <div className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
              <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="(max-width: 640px) 80px, 128px" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-myGrayDark mb-1 break-words">{listing.title}</h2>
              <div className="flex items-center gap-2 text-myGray">
                <FaMapMarkerAlt className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">
                  {listing.location.city}, {listing.location.country}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-4 flex-shrink-0">
            <div className="text-left lg:text-right">
              <div className="text-xl sm:text-2xl font-bold text-myGreenSemiBold">{reservations.length}</div>
              <div className="text-xs sm:text-sm text-myGray">Total reservations</div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors hover:cursor-pointer flex-shrink-0"
            >
              {isExpanded ? <FaChevronUp className="w-5 h-5 text-myGray" /> : <FaChevronDown className="w-5 h-5 text-myGray" />}
            </button>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-6 mt-4 justify-center sm:justify-start">
          <div className="text-center">
            <div className="text-base sm:text-lg font-semibold text-myGreenSemiBold">{upcomingCount}</div>
            <div className="text-xs sm:text-sm text-myGray">Upcoming</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-semibold text-myGray">{completedCount}</div>
            <div className="text-xs sm:text-sm text-myGray">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-base sm:text-lg font-semibold text-red-500">{canceledCount}</div>
            <div className="text-xs sm:text-sm text-myGray">Canceled</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ReservationsTable reservations={reservations} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
