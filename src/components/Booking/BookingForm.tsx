"use client";

import { useQueryParams } from "@/hooks/useQueryParams";
import { Guests, Listing } from "@/lib/types";
import { listingGuests } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import type { RangeKeyDict } from "react-date-range";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css"; // estilos base
import "react-date-range/dist/theme/default.css"; // tema por defecto

export default function BookingForm({
  listing,
  priceFirst = false,
  children,
  onConfirm,
}: {
  listing: Listing;
  priceFirst?: boolean;
  children?: ReactNode;
  onConfirm?: (range: Range) => void;
}) {
  const guestParams = useQueryParams<Guests>(listingGuests);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [guests, setGuests] = useState<Record<Guests, number>>({
    adults: Math.min(listing.guestLimits["adults"].max, Number(guestParams.adults)) || 1,
    children: Math.min(listing.guestLimits["children"].max, Number(guestParams.children)) || 0,
    infant: Math.min(listing.guestLimits["infant"].max, Number(guestParams.infant)) || 0,
    pets: Math.min(listing.guestLimits["pets"].max, Number(guestParams.pets)) || 0,
  });

  const updateGuestParamsInUrl = useCallback(
    (updatedGuests: Record<string, number>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updatedGuests).forEach(([key, value]) => {
        if (value > 0) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }

        router.replace(`?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  useEffect(() => {
    updateGuestParamsInUrl(guests);
  }, [guests, updateGuestParamsInUrl]);

  const handleChangeDateRange = (ranges: RangeKeyDict) => {
    const selection = ranges["selection"];
    if (selection?.startDate && selection?.endDate) {
      setDateRange(selection);
    }
  };

  const handleGuest = (type: Guests, amount: number) => {
    setGuests((prevState) => ({
      ...prevState,
      [type]: prevState[type] + amount,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    //Validate form data
  };

  return (
    <form onSubmit={handleSubmit}>
      {!priceFirst && (
        <DateRange ranges={[dateRange]} onChange={handleChangeDateRange} minDate={new Date()} rangeColors={["#3ecf8e"]} showDateDisplay={false} />
      )}
      <div className="flex sm:mt-4">
        <ListingPrice dateRange={dateRange} listing={listing} />
        <div>
          {listingGuests.map((type) => (
            <div key={type} className="flex gap-5">
              <span className="capitalize">{type}</span>
              <button
                disabled={guests[type] === listing.guestLimits[type].min}
                className="bg-myGreen rounded-full w-6 h-6 hover:cursor-pointer"
                onClick={() => handleGuest(type, -1)}
              >
                -
              </button>
              <span>{guests[type]}</span>
              <button
                disabled={guests[type] === listing.guestLimits[type].max}
                className="bg-myGreen rounded-full w-6 h-6 hover:cursor-pointer"
                onClick={() => handleGuest(type, 1)}
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>
      {priceFirst && (
        <DateRange ranges={[dateRange]} onChange={handleChangeDateRange} minDate={new Date()} rangeColors={["#3ecf8e"]} showDateDisplay={false} />
      )}

      <div className="flex justify-center gap-10">
        {children}
        {onConfirm && (
          <button type="submit" onClick={() => onConfirm(dateRange)} className="px-4 py-2 bg-myGreen text-white rounded-4xl">
            Reserve
          </button>
        )}
      </div>
    </form>
  );
}

function ListingPrice({ dateRange, listing }: { dateRange: Range; listing: Listing }) {
  const summary = calculateTotal(dateRange, listing);

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
