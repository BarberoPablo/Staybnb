"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Listing } from "@/lib/types/listing";
import { buildQueryStringFromParams } from "@/lib/utils";
import { useMemo } from "react";
import HomeListingCard from "../../components/HomeListingCard";

export function ListingCards({
  listings,
  setLocateListing,
  searchParams,
}: {
  listings: Listing[];
  setLocateListing: (listingId: number) => void;
  searchParams: Record<string, string>;
}) {
  const is2xl = useMediaQuery("(min-width: 1536px)");
  const isMd = useMediaQuery("(min-width: 768px)");

  let columns = 1;

  if (is2xl) {
    columns = adaptiveColumns(listings.length, 3);
  } else if (isMd) {
    columns = adaptiveColumns(listings.length, 2);
  }

  const listingHrefs = useMemo(() => {
    const queryString = searchParams ? buildQueryStringFromParams(searchParams) : "";
    console.log("re-renmder");
    return listings.reduce(
      (acc, listing) => {
        const baseHref = `/listing/${listing.id}`;
        acc[listing.id] = queryString ? `${baseHref}?${queryString}` : baseHref;
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [listings, searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 h-[90px] bg-myGreenExtraLight rounded-xl border border-myGreenSemiBold/20">
        <div className="w-8 h-8 bg-myGreen rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-myGrayDark">{listings.length}</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-myGrayDark">Places Found</h2>
          <p className="text-sm text-myGray">Explore these amazing locations</p>
        </div>
      </div>

      <div
        className="flex flex-col gap-6"
        style={{
          display: columns > 1 ? "grid" : "flex",
          gridTemplateColumns: columns > 1 ? `repeat(${columns}, minmax(0, 1fr))` : undefined,
        }}
      >
        {listings.map((listing) => (
          <HomeListingCard key={listing.id} listing={listing} setLocateListing={setLocateListing} href={listingHrefs[listing.id]} />
        ))}
      </div>
    </div>
  );
}

/* 
When layout changes, keen-slider does not notices the change in column count, making the images to break.
This is fixed by using a specific key for each layout category.
*/

function adaptiveColumns(listingsLength: number, maxColumns: number) {
  return Math.min(listingsLength, maxColumns);
}
