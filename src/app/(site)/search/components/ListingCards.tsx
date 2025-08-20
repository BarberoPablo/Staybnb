import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Listing } from "@/lib/types/listing";
import ListingCard from "./ListingCard";

export function ListingCards({
  listings,
  locateListing,
  setLocateListing,
}: {
  listings: Listing[];
  locateListing: number;
  setLocateListing: (listingId: number) => void;
}) {
  const is2xl = useMediaQuery("(min-width:1536px)");
  const isMd = useMediaQuery("(min-width: 768px)");

  let columns = 1;

  if (is2xl) {
    columns = adaptiveColumns(listings.length, 3);
  } else if (isMd) {
    columns = adaptiveColumns(listings.length, 2);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 h-[90px] bg-myGreenLight rounded-xl border border-myGreenBold/20">
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
          <ListingCard key={listing.id} listing={listing} locateListing={locateListing} setLocateListing={setLocateListing} />
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
