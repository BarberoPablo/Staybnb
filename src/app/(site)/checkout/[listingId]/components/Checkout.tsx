"use client";

import ListingResume from "@/app/(site)/checkout/[listingId]/components/ListingResume";
import PaymentSection from "@/app/(site)/checkout/[listingId]/components/PaymentSection";
import { Container } from "@/app/(site)/components/Container";
import ListingStatusBanner from "@/components/ListingStatusBanner";
import { Guests, ListingSearchParams } from "@/lib/types";
import { Listing, Promotion } from "@/lib/types/listing";
import { calculateNights, getGuestsFromParams, getListingPromotion } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export type ListingData = {
  listing: Listing;
  guests: Record<Guests, number>;
  startDate: Date;
  endDate: Date;
  nights: number;
  promo: Promotion | null;
};

export default function Checkout({ listing, searchParams }: { listing: Listing; searchParams: ListingSearchParams }) {
  const startDate = new Date(searchParams.startDate);
  const endDate = new Date(searchParams.endDate);
  const nights = calculateNights(startDate, endDate);
  const [listingData, setListingData] = useState<ListingData>({
    listing,
    guests: getGuestsFromParams(searchParams),
    startDate,
    endDate,
    nights,
    promo: getListingPromotion(listing, nights),
  });

  return (
    <Container>
      {/* Listing Status Banner */}
      <ListingStatusBanner status={listing.status} />

      {/* Page Header */}
      <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-4xl font-bold text-myGrayDark mb-2">Complete Your Booking</h1>
        <p className="text-myGray text-lg">Review your trip details and complete payment</p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Payment Section */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <PaymentSection listingData={listingData} />
        </motion.div>

        {/* Listing Resume */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ListingResume listingData={listingData} setListingData={setListingData} />
        </motion.div>
      </div>
    </Container>
  );
}
