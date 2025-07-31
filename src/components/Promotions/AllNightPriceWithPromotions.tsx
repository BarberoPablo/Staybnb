import { Listing } from "@/lib/types/listing";
import { NightPriceWithPromotion } from "./NightPriceWithPromotion";

export function AllNightPriceWithPromotions({ listing, className }: { listing: Listing; className?: string }): React.ReactNode | null {
  if (listing.promotions.length === 0) return null;

  return (
    <>
      {listing.promotions.map((_, index) => (
        <NightPriceWithPromotion key={listing.id + "-promotion-" + index} listing={listing} index={index} className={className} />
      ))}
    </>
  );
}
