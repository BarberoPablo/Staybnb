"use client";

import ListingCard from "@/components/ListingCard";
import { api } from "@/lib/api/api";
import { Listing } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (city) {
      const fetchListings = async () => {
        try {
          const { success, data, error } = await api.getListings(city);
          if (success) {
            setFilteredListings(data);
          } else {
            throw error;
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchListings();
    }
  }, [city]);

  if (filteredListings.length === 0 && !loading) return <div>No listings found in {city}</div>;

  if (loading) return <div>Searching listings from: {city}</div>;

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
