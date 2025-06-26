"use client";

import ListingResume from "@/app/checkout/[listingId]/components/ListingResume";
import { useQueryParams } from "@/hooks/useQueryParams";
import { mockListings } from "@/lib/mockListings";
import { listingQueryParams } from "@/lib/utils";
import { useParams } from "next/navigation";
import PaymentSection from "./components/PaymentSection";

export default function Checkout() {
  const { listingId } = useParams<{ listingId: string }>();
  const params = useQueryParams(listingQueryParams);

  if (!listingId || !params.startDate || !params.endDate || !params.adults) {
    return (
      <div>
        <h1>Invalid information (check dates, guests and listing)</h1>
      </div>
    );
  }

  const listing = mockListings.find((listing) => listing.id === parseInt(listingId.toString()));

  if (!listing) {
    return (
      <div>
        <h1>Listing not found</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 relative">
      <div className="flex justify-center col-span-2 sm:col-span-1">
        <PaymentSection />
      </div>
      <div className="flex justify-center col-span-2 sm:col-span-1">
        <ListingResume listing={listing} params={params} />
      </div>
    </div>
  );
}
