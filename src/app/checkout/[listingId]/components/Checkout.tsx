"use client";

import ListingResume from "@/app/checkout/[listingId]/components/ListingResume";
import PaymentSection from "@/app/checkout/[listingId]/components/PaymentSection";
import { Guests, Listing, ListingSearchParams, ListingSummary } from "@/lib/types";
import { createListingData } from "@/lib/utils";
import { useState } from "react";

export type ListingData = {
  listing: Listing;
  guests: Record<Guests, number>;
  startDate: Date;
  endDate: Date;
  summary: ListingSummary;
};

export default function Checkout({ listing, searchParams }: { listing: Listing; searchParams: ListingSearchParams }) {
  const { guests, startDate, endDate, summary } = createListingData(searchParams, listing);
  const [listingData, setListingData] = useState<ListingData>({ listing, guests, startDate, endDate, summary });

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
