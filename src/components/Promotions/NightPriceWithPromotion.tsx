import { Listing } from "@/lib/types/listing";
import { twoDecimals } from "@/lib/utils";

export function NightPriceWithPromotion({ listing, index, className }: { listing: Listing; index?: number; className?: string }): React.ReactNode | null {
  if (listing.promotions.length === 0) return null;

  const validIndex = typeof index === "number" && index >= 0 && index < listing.promotions.length ? index : 0;
  const promotion = listing.promotions[validIndex];
  const originalPrice = promotion.minNights * listing.nightPrice;
  const promotionalPrice = twoDecimals(promotion.minNights * listing.nightPrice * ((100 - promotion.discountPercentage) / 100));

  return (
    <div className={`flex gap-1 text-sm ${className || ""}`}>
      <span className="line-through text-myGray">${originalPrice} USD</span>
      <span className="font-semibold">
        ${promotionalPrice} USD for {promotion.minNights} nights
      </span>
    </div>
  );
}
