"use client";

import { api } from "@/lib/api/api";
import { Listing } from "@/lib/types/listing";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ListingCards } from "./components/ListingCards";

const ListingsMapNoSSR = dynamic(() => import("./components/ListingsMap"), { ssr: false });

export default function SearchPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const layoutKey = getLayoutCategory(filteredListings.length);

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
          <ListingCards key={layoutKey} listings={filteredListings} />
        </div>
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col sticky top-10 h-[calc(100vh-176px)] bg-blue-500">
          <ListingsMapNoSSR listings={filteredListings} setListings={setFilteredListings} />
        </div>
      </div>
    </div>
  );
}

function getLayoutCategory(count: number) {
  if (count === 1) return "single-col";
  if (count === 2) return "double-col";
  return "triple-col";
}

/*  ListingCards key={layoutKey} ↓
To ensure the listing layout re-renders only when necessary, we assign a specific key to <ListingCards> based on the number of columns it should display.
This avoids layout glitches (e.g., with Keen slider) that occur when the column count changes but React doesn't remount the component.

We don't use `key={filteredListings.length}` because that would trigger a full remount every time the number of listings changes, even if the column layout remains the same.
Instead, this function maps listing counts to layout categories (single, double, triple column), ensuring remounting happens *only* when the visual layout needs to adapt.
*/
