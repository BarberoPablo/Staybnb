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
      className="bg-white/60 rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden">
              <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-myGrayDark mb-1">{listing.title}</h2>
              <div className="flex items-center gap-2 text-myGray">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>
                  {listing.location.city}, {listing.location.country}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-myGreenSemiBold">{reservations.length}</div>
              <div className="text-sm text-myGray">Total reservations</div>
            </div>
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-full hover:bg-gray-100 transition-colors hover:cursor-pointer">
              {isExpanded ? <FaChevronUp className="w-5 h-5 text-myGray" /> : <FaChevronDown className="w-5 h-5 text-myGray" />}
            </button>
          </div>
        </div>

        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-myGreenSemiBold">{upcomingCount}</div>
            <div className="text-sm text-myGray">Upcoming</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-myGray">{completedCount}</div>
            <div className="text-sm text-myGray">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-500">{canceledCount}</div>
            <div className="text-sm text-myGray">Canceled</div>
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
