import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Listing } from "@/lib/types/listing";
import { useEffect } from "react";
import ListingCard from "./ListingCard";

export function ListingCards({ listings, setLocateListing }: { listings: Listing[]; setLocateListing: (listingId: number) => void }) {
  const is2xl = useMediaQuery("(min-width:1536px)");
  const isMd = useMediaQuery("(min-width: 768px)");

  let columns = 1;

  if (is2xl) {
    columns = adaptiveColumns(listings.length, 3);
  } else if (isMd) {
    columns = adaptiveColumns(listings.length, 2);
  }

  useEffect(() => {
    console.log("ListingCards mounted or re-mounted");
    return () => {
      console.log("ListingCards unmounted");
    };
  }, []);

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
          <ListingCard key={listing.id} listing={listing} setLocateListing={setLocateListing} />
        ))}
      </div>
    </div>
  );
}

/* 
To ensure the listing layout re-renders only when necessary, we assign a specific key to <ListingCards> based on the number of columns it should display.
This avoids layout glitches (e.g., with Keen slider) that occur when the column count changes but React doesn't remount the component.

We don't use `key={filteredListings.length}` because that would trigger a full remount every time the number of listings changes, even if the column layout remains the same.
Instead, this function maps listing counts to layout categories (single, double, triple column), ensuring remounting happens *only* when the visual layout needs to adapt.
*/

function adaptiveColumns(listingsLength: number, maxColumns: number) {
  return Math.min(listingsLength, maxColumns);
}
