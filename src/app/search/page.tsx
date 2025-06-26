"use client";

import ListingCard from "@/components/ListingCard";
import { mockListings } from "@/lib/mockListings";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");

  const filteredListings = mockListings.filter((place) => place.location.toLowerCase().includes(city?.toLowerCase() || ""));

  if (filteredListings.length === 0) return <div>No listings found in {city}</div>;

  return (
    <div className="grid lg:grid-cols-2 gap-x-8">
      {/* Listings */}
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">{filteredListings.length} places found</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 bg-blue-300">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
      {/* Map */}
      <div className="bg-blue-500"></div>
    </div>
  );
}
