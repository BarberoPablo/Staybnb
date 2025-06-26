"use client";

import ListingPrice from "@/components/ListingPrice";
import { useQueryParams } from "@/hooks/useQueryParams";
import { mockListings } from "@/lib/mockListings";
import type { Guests, Listing } from "@/lib/types";
import { displayGuestLabel, listingGuests } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

const queryParams = ["startDate", "endDate", "adults", "children", "infant", "pets"];
export default function Checkout() {
  const { listingId } = useParams<{ listingId: string }>();
  const params = useQueryParams(queryParams);

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
      <div className="flex justify-center grid-span1">
        <h1>Select Payment method</h1>
        <button disabled className="opacity-50 cursor-not-allowed">
          Pay with Stripe (not implemented)
        </button>
      </div>
      <div className="flex justify-center grid-span1">
        <div className="border border-gray-300 w-full h-full">
          <ListingResume listing={listing} params={params} />
        </div>
      </div>
    </div>
  );
}

function ListingResume({ listing, params }: { listing: Listing; params: Partial<Record<(typeof queryParams)[number], string>> }) {
  const [dateRange, setDateRange] = useState({
    startDate: params.startDate ? new Date(params.startDate) : new Date(),
    endDate: params.endDate ? new Date(params.endDate) : new Date(),
  });
  const guests = Object.entries(params).filter(([key, value]) => listingGuests.includes(key as Guests) && value !== "0");

  return (
    <div className="w-full h-full p-8">
      <div className="flex gap-4">
        <Image
          src={listing.images[0]}
          alt="listing main image"
          className="object-cover w-[200px] h-[200px] sm:w-[100px] sm:h-[100px] rounded-xl"
          width={200}
          height={200}
          sizes="(max-width: 640px) 200px, 100px"
        />
        <div className="flex flex-col">
          <h2>{listing.title}</h2>
          <h3>
            ⭐{listing.score.value} ({listing.score.reviews.length})
          </h3>
        </div>
      </div>

      <hr className="text-gray-300 my-4" />

      <div className="flex flex-col">
        <h2>Trip information</h2>
        <div className="flex">
          <span>
            {dateRange.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
            {dateRange.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <button>Change</button>
        </div>
        {guests.map(([guest, value]) => (
          <span key={guest}>{displayGuestLabel(guest as Guests, Number(value))}</span>
        ))}
      </div>

      <hr className="text-gray-300 my-4" />

      <div className="flex flex-col">
        <h2>Price details</h2>
        <ListingPrice startDate={dateRange.startDate} endDate={dateRange.endDate} listing={listing} />
      </div>
    </div>
  );
}
