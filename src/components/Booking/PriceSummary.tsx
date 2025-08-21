import { Listing, ListingWithReservations } from "@/lib/types/listing";
import { getTotalPrice } from "@/lib/utils";
import { IoPricetag } from "react-icons/io5";

export function PriceSummary({
  nights,
  listing,
  discountPercentage,
  className,
}: {
  nights: number;
  listing: Listing | ListingWithReservations;
  discountPercentage?: number;
  className?: string;
}) {
  return (
    <div className={className ?? `bg-gradient-to-r from-myGreenExtraLight to-myGreenSemiBold/10 rounded-xl p-4 border border-myGreenSemiBold/20`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 bg-myGreen rounded-full flex items-center justify-center">
          <IoPricetag className="w-5 h-5 text-myGrayDark" />
        </div>
        <span className="text-lg font-semibold text-myGrayDark">Price Summary</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-myGray">Selected:</span>
          <span className="font-bold text-lg text-myGrayDark">
            {nights} night{nights > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-myGray">Price per night:</span>
          <span className="font-semibold text-myGrayDark">${listing.nightPrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-myGray">Discount:</span>
          {discountPercentage && discountPercentage > 0 ? (
            <span className="font-semibold text-myGreenSemiBold">
              {(getTotalPrice(nights, listing.nightPrice) * discountPercentage) / 100} USD ({discountPercentage}% off)
            </span>
          ) : (
            <span className="font-semibold text-myGrayDark">-</span>
          )}
        </div>
        <div className="border-t border-myGreenSemiBold/20 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-myGrayDark">Total:</span>
            <div className="flex items-center gap-2">
              {discountPercentage ? (
                <span className="text-myGray text-lg font-medium line-through decoration-2 decoration-myGray/70">
                  ${getTotalPrice(nights, listing.nightPrice).toFixed(2)}
                </span>
              ) : null}
              <span className="text-myGrayDark text-xl font-bold">${getTotalPrice(nights, listing.nightPrice, discountPercentage).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
