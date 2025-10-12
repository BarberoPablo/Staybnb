"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ParsedFilters } from "@/lib/api/server/utils";
import { City } from "@/lib/types/cities";
import { Listing } from "@/lib/types/listing";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { Container } from "../../components/Container";
import DialogMap from "./DialogMap";
import { ListingCards } from "./ListingCards";
import { NoListingsFound } from "./NoListingsFound";

const ListingsMapNoSSR = dynamic(() => import("./ListingsMap"), { ssr: false });

export default function SearchContainer({
  listings,
  city,
  cityCenter,
  cities,
  filters,
}: {
  listings: Listing[];
  city: string | undefined;
  cityCenter: { lat: number; lng: number } | null;
  cities: City[];
  filters: ParsedFilters;
}) {
  const [locateListing, setLocateListing] = useState(-1);
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const layoutKey = getLayoutCategory(filteredListings.length);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [openMap, setOpenMap] = useState(false);

  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

  // Detect when a new search happens (city or filters change)
  useEffect(() => {
    setSearchTriggered(true);
  }, [city, filters]);

  const handleSearchComplete = () => {
    setSearchTriggered(false);
  };

  const handleOpenMap = () => {
    setOpenMap(true);
  };

  return (
    <Container noPadding className="px-12">
      <div>
        {/* Search Results */}
        <motion.div
          className="flex w-full h-full items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-10 xl:grid-cols-10 gap-x-8 w-full h-full">
            {/* Listings Section */}
            <div className="lg:max-w-7xl lg:col-span-6 xl:col-span-5 py-10">
              {filteredListings.length === 0 ? (
                <NoListingsFound city={city} cities={cities} filters={filters} />
              ) : (
                <ListingCards key={layoutKey} listings={filteredListings} setLocateListing={setLocateListing} />
              )}
            </div>

            {/* Map Section */}
            {isLargeScreen && (
              <div className="lg:col-span-4 xl:col-span-5 flex flex-col sticky top-10 h-[calc(100vh-177px)] my-10 flex-1 bg-white rounded-xl overflow-hidden shadow-lg">
                <ListingsMapNoSSR
                  listings={filteredListings}
                  locateListing={locateListing}
                  setListings={setFilteredListings}
                  cityCenter={cityCenter}
                  searchTriggered={searchTriggered}
                  onSearchComplete={handleSearchComplete}
                />
              </div>
            )}
            {!isLargeScreen && (
              <button
                className="flex items-center justify-center sticky bottom-6 left-1/2 transform -translate-x-1/2 w-15 h-15 text-2xl bg-myGreen rounded-full text-myGrayDark border-2 border-myGreenSemiBold cursor-pointer"
                onClick={() => handleOpenMap()}
              >
                <FaMapMarkedAlt />
              </button>
            )}
          </div>
        </motion.div>
        <DialogMap
          open={openMap}
          onClose={() => setOpenMap(false)}
          listings={filteredListings}
          locateListing={locateListing}
          cityCenter={cityCenter}
          setListings={setFilteredListings}
          searchTriggered={searchTriggered}
          onSearchComplete={handleSearchComplete}
        />
      </div>
    </Container>
  );
}

function getLayoutCategory(count: number) {
  if (count === 1) return "single-col";
  if (count === 2) return "double-col";
  return "triple-col";
}
