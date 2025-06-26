import { Listing } from "@/lib/types";
import { calculateTotal } from "@/lib/utils";
import React from "react";

export default function ListingPrice({ startDate, endDate, listing }: { startDate: Date | undefined; endDate: Date | undefined; listing: Listing }) {
  const summary = calculateTotal(startDate, endDate, listing);

  return (
    <div className="text-sm">
      <p>
        {summary.nights} night{summary.nights > 1 ? "s" : ""} x ${listing.price} = <b>${summary.baseTotal.toFixed(2)}</b>
      </p>
      {summary.discount && (
        <p className="text-green-600">
          {listing.promotions?.[0].discountPercentage}% discount applied: -${summary.discount.toFixed(2)}
        </p>
      )}
      <p className="font-bold mt-2">Total: ${summary.total.toFixed(2)}</p>
    </div>
  );
}
