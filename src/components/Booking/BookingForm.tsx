"use client";
import { Listing } from "@/lib/types";
import { useState } from "react";
import type { RangeKeyDict } from "react-date-range";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css"; // estilos base
import "react-date-range/dist/theme/default.css"; // tema por defecto

export default function BookingForm({ listing, onConfirm }: { listing: Listing; onConfirm?: (range: Range) => void }) {
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleChange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];
    if (selection?.startDate && selection?.endDate) {
      setDateRange(selection);
    }
  };

  const summary = calculateTotal(dateRange, listing);

  return (
    <div>
      <DateRange ranges={[dateRange]} onChange={handleChange} minDate={new Date()} rangeColors={["#3ecf8e"]} showDateDisplay={false} />

      <div className="text-sm mt-4">
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

      {onConfirm && (
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => onConfirm(dateRange)} className="px-4 py-2 bg-black text-white rounded">
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}

function calculateTotal(dateRange: Range, listing: Listing) {
  const { startDate, endDate } = dateRange;
  if (!startDate || !endDate) return { nights: 0, baseTotal: 0, total: 0 };

  const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const baseTotal = nights * listing.price;

  const promotion = listing.promotions?.find((promo) => nights >= promo.minNights);
  if (promotion) {
    const discount = (promotion.discountPercentage / 100) * baseTotal;
    return { nights, baseTotal, discount, total: baseTotal - discount };
  }

  return { nights, baseTotal, total: baseTotal };
}
