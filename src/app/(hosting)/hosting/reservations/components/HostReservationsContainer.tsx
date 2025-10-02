"use client";

import { Listing } from "@/lib/types/listing";
import { Reservation } from "@/lib/types/reservation";
import { motion } from "framer-motion";
import HostListingReservationsCard from "./HostListingReservationsCard";

interface HostReservationsContainerProps {
  listingsWithReservations: {
    listing: Listing;
    reservations: Reservation[];
  }[];
}

export default function HostReservationsContainer({ listingsWithReservations }: HostReservationsContainerProps) {
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

  if (listingsWithReservations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-myGreenExtraLight flex items-center justify-center">
            <span className="text-4xl">📅</span>
          </div>
          <h3 className="text-2xl font-bold text-myGrayDark mb-4">No reservations yet</h3>
          <p className="text-myGray mb-8">When guests book your listings, their reservations will appear here.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {listingsWithReservations.map((item) => (
        <HostListingReservationsCard key={item.listing.id} listing={item.listing} reservations={item.reservations} />
      ))}
    </motion.div>
  );
}
