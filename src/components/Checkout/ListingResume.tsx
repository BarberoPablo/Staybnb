import { Guests, Listing } from "@/lib/types";
import { displayGuestLabel, listingGuests, listingQueryParams } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import ListingPrice from "./ListingPrice";

export default function ListingResume({ listing, params }: { listing: Listing; params: Partial<Record<(typeof listingQueryParams)[number], string>> }) {
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
