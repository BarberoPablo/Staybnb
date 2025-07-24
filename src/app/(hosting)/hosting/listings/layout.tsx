"use client";

import Navbar from "@/components/Navbar";
import { api } from "@/lib/api/api";
import { Listing } from "@/lib/types/listing";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HostListingCard } from "./components/HostListingCard";
import { SkeletonListingCard } from "@/components/Skeleton/SkeletonListingCard";

export default function HostListingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getListingsWithReservations = async () => {
      const listingsWithReservations = await api.getHostListings();
      setLoading(false);
      setListings(listingsWithReservations);
    };
    getListingsWithReservations();
  }, []);

  const handleGoBack = () => {
    router.replace("/hosting");
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
          <div className="flex flex-col gap-10">
            <div className="flex items-center justify-center gap-30">
              {loading
                ? Array.from({ length: 2 }).map((_, i) => <SkeletonListingCard key={i} />)
                : listings.map((listing) => <HostListingCard key={listing.id} listing={listing} />)}
            </div>
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
