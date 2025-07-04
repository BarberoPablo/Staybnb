"use client";

import ListingResume from "@/app/checkout/[listingId]/components/ListingResume";
import PaymentSection from "@/app/checkout/[listingId]/components/PaymentSection";
import { Guests, ListingSearchParams } from "@/lib/types";
import { Listing, Promotion } from "@/lib/types/listing";
import { calculateNights, getGuestsFromParams, getListingPromotion } from "@/lib/utils";
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
    <div className="grid grid-cols-2 relative">
      <div className="flex justify-center col-span-2 sm:col-span-1">
        <PaymentSection listingData={listingData} />
      </div>
      <div className="flex justify-center items-center col-span-2 sm:col-span-1">
        <ListingResume listingData={listingData} setListingData={setListingData} />
      </div>
    </div>
  );
}
