"use client";

import { Listing } from "@/lib/types/listing";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Container } from "../../components/Container";
import { ListingCards } from "./ListingCards";

const ListingsMapNoSSR = dynamic(() => import("./ListingsMap"), { ssr: false });

export default function SearchContainer({ listings, city }: { listings: Listing[]; city: string | undefined }) {
  const [locateListing, setLocateListing] = useState(-1);
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const layoutKey = getLayoutCategory(filteredListings.length);

  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

  return (
    <Container>
      <div className="space-y-6">
        {/* Search Results */}
        <motion.div
          className="flex w-full h-full items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-10 xl:grid-cols-10 gap-x-8 w-full h-full">
            {/* Listings Section */}
            <div className="lg:max-w-7xl lg:col-span-6 xl:col-span-5">
              {filteredListings.length === 0 ? (
                <div className="h-[calc(100vh-177px)] text-center py-12 px-[-16px]">
                  <IoSearch className="w-16 h-16 text-myGray mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-myGrayDark mb-2">No listings found</h1>
                  <p className="text-myGray">We couldn&apos;t find any places {city ? `in ${city}` : ""}</p>
                </div>
              ) : (
                <ListingCards key={layoutKey} listings={filteredListings} setLocateListing={setLocateListing} />
              )}
            </div>

            {/* Map Section */}
            <div className="lg:col-span-4 xl:col-span-5 flex flex-col sticky top-10 h-[calc(100vh-177px)] flex-1 bg-white rounded-xl overflow-hidden shadow-lg">
              <ListingsMapNoSSR listings={filteredListings} locateListing={locateListing} setListings={setFilteredListings} />
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
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
