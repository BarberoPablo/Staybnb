"use client";

import ListingCard from "@/components/ListingCard";
import { api } from "@/lib/api/api";
import { MapCoordinates } from "@/lib/types";
import { Listing } from "@/lib/types/listing";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ListingsMapNoSSR = dynamic(() => import("./components/ListingsMap"), { ssr: false });

export default function SearchPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (city) {
      const fetchListings = async () => {
        try {
          const listings = await api.getListings({ city });
          setFilteredListings(listings);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchListings();
    }
  }, [city]);

  const handleMapMove = async ({ zoom, northEast, southWest }: MapCoordinates) => {
    try {
      const listings = await api.getListings({ zoom, northEast, southWest });

      setFilteredListings(listings);
    } catch (error) {
      console.error("Error fetching listings by moving the map", error);
    }
  };

  if (filteredListings.length === 0 && !loading) return <div>No listings found in {city}</div>;

  if (loading) return <div>Searching listings from: {city}</div>;

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="grid lg:grid-cols-2 gap-x-8 w-full h-full">
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
        <div className="flex flex-col sticky top-10 h-[calc(100vh-176px)] bg-blue-500">
          <ListingsMapNoSSR listings={filteredListings} onMapMove={handleMapMove} />
        </div>
      </div>
    </div>
  );
}
