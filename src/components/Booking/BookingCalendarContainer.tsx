"use client";

import { ListingWithReservations } from "@/lib/types/listing";
import { motion } from "framer-motion";
import { IoCalendar } from "react-icons/io5";
import BookingForm from "./BookingForm";

export default function BookingCalendarContainer({ listing }: { listing: ListingWithReservations }) {
  return (
    <motion.div
      className="bg-background border border-gray-200 rounded-2xl shadow-lg p-6 sticky top-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-myGreenLight rounded-full flex items-center justify-center">
          <IoCalendar className="w-6 h-6 text-myGrayDark" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-myGrayDark">Book Your Stay</h3>
          <p className="text-sm text-myGray">Select dates and guests</p>
        </div>
      </div>

      <BookingForm listing={listing} priceFirst={true} />
    </motion.div>
  );
}
