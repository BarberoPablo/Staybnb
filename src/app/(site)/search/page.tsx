"use client";

import ListingCard from "@/components/ListingCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { api } from "@/lib/api/api";
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

  if (filteredListings.length === 0 && !loading) return <div>No listings found in {city}</div>;

  if (loading) return <div>Searching listings from: {city}</div>;

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col lg:grid lg:grid-cols-10 xl:grid-cols-10 gap-x-8 w-full h-full">
        <div className="lg:max-w-7xl lg:col-span-6 xl:col-span-5">
          <ListingCards listings={filteredListings} />
        </div>
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col sticky top-10 h-[calc(100vh-176px)] bg-blue-500">
          <ListingsMapNoSSR listings={filteredListings} setListings={setFilteredListings} />
        </div>
      </div>
    </div>
  );
}

function ListingCards({ listings }: { listings: Listing[] }) {
  const is2xl = useMediaQuery("(min-width:1536px)");
  const isMd = useMediaQuery("(min-width: 768px)");

  let columns = 1;

  if (is2xl) {
    columns = adaptiveColumns(listings.length, 3);
  } else if (isMd) {
    columns = adaptiveColumns(listings.length, 2);
  }

  return (
    <div className={`flex flex-col gap-4 `}>
      <p className="text-sm text-gray-600">{listings.length} places found</p>
      <div
        className="flex flex-col gap-6"
        style={{
          display: columns > 1 ? "grid" : "flex",
          gridTemplateColumns: columns > 1 ? `repeat(${columns}, minmax(0, 1fr))` : undefined,
        }}
      >
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

function adaptiveColumns(listingsLength: number, maxColumns: number) {
  return Math.min(listingsLength, maxColumns);
}
