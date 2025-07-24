"use client";

import Navbar from "@/components/Navbar";
import { api } from "@/lib/api/api";
import { Listing } from "@/lib/types/listing";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HostListingCard } from "./components/HostListingCard";

export default function HostListingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<number>();

  useEffect(() => {
    const getListingsWithReservations = async () => {
      setLoading(true);
      const listingsWithReservations = await api.getHostListings();
      console.log({ listingsWithReservations });
      setLoading(false);
      setListings(listingsWithReservations);
    };
    getListingsWithReservations();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <header>
        <Navbar search={false} />
      </header>
      <main className="w-full mt-2 flex-grow px-5">
        <div>
          <button className="hover:cursor-pointer" onClick={handleGoBack}>
            Back
          </button>
          <div>
            <div className="flex items-center justify-center gap-30">
              {loading && <div>Loading listings...</div>}
              {listings.map((listing) => (
                <HostListingCard
                  key={listing.id}
                  listing={listing}
                  className={`${selectedListing === listing.id && "border-2"}`}
                  setSelectedListing={() => setSelectedListing(listing.id)}
                />
              ))}
            </div>
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
