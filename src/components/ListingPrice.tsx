import { Listing, ListingSummary } from "@/lib/types";

export default function ListingPrice({ summary, listing }: { summary: ListingSummary; listing: Listing }) {
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
