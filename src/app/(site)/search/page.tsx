"use client";

import { api } from "@/lib/api/api";
import { Listing } from "@/lib/types/listing";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Container } from "../components/Container";
import { ListingCards } from "./components/ListingCards";

const ListingsMapNoSSR = dynamic(() => import("./components/ListingsMap"), { ssr: false });

export default function SearchPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const layoutKey = getLayoutCategory(filteredListings.length);
  const [locateListing, setLocateListing] = useState(-1);

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

  if (filteredListings.length === 0 && !loading) {
    return (
      <Container>
        <div className="space-y-6">
          <div className="text-center py-12">
            <IoSearch className="w-16 h-16 text-myGray mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-myGrayDark mb-2">No listings found</h1>
            <p className="text-myGray">We couldn&apos;t find any places in {city}</p>
          </div>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin w-16 h-16 border-4 border-myGreenBold border-t-transparent rounded-full mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold text-myGrayDark mb-2">Searching listings</h1>
            <p className="text-myGray">Looking for amazing places in {city}</p>
          </div>
        </div>
      </Container>
    );
  }

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
              <ListingCards key={layoutKey} listings={filteredListings} setLocateListing={setLocateListing} />
            </div>

            {/* Map Section */}
            <div className="lg:col-span-4 xl:col-span-5 flex flex-col sticky top-10 h-[calc(100vh-177px)]">
              <div className="bg-myGreenLight rounded-xl border border-myGreenBold/20 p-4 mb-4">
                <h3 className="text-lg font-semibold text-myGrayDark mb-2">Interactive Map</h3>
                <p className="text-sm text-myGray">Click on markers to see listing details or move around!</p>
              </div>
              <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-lg">
                <ListingsMapNoSSR listings={filteredListings} locateListing={locateListing} setListings={setFilteredListings} />
              </div>
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
