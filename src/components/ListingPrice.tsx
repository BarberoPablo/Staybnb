import { Listing, ListingSummary } from "@/lib/types";

export default function ListingPrice({ summary, listing }: { summary: ListingSummary; listing: Listing }) {
  return (
    <div className="text-sm">
      <p>
        {summary.nights} night{summary.nights > 1 ? "s" : ""} x ${listing.price} = <b>${summary.baseTotal}</b>
      </p>

      {summary.discount !== 0 && summary.discountPercentage !== 0 && (
        <p className="text-green-600">
          {summary.discountPercentage}% discount applied: -${summary.discount}
        </p>
      )}
      {summary.discount !== 0 && summary.discountPercentage === 0 && <p className="text-green-600">Flat discount applied: -${summary.discount}</p>}
      <p className="font-bold mt-2">Total: ${summary.total}</p>
    </div>
  );
}
