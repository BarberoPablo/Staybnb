"use client";

import ListingResume from "@/components/Checkout/ListingResume";
import { useQueryParams } from "@/hooks/useQueryParams";
import { mockListings } from "@/lib/mockListings";
import { listingQueryParams } from "@/lib/utils";
import { useParams } from "next/navigation";

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
    <div className="grid grid-cols-2">
      <div className="flex justify-center col-span-2 sm:col-span-1">
        <h1>Select Payment method</h1>
        <button>Pay</button>
      </div>
      <div className="flex justify-center col-span-2 sm:col-span-1">
        <div className="border border-gray-300 w-full h-full">
          <ListingResume listing={listing} params={params} />
        </div>
      </div>
    </div>
  );
}
